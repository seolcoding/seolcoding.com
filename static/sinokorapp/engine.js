// 업무 계산은 화면·문장 생성과 분리한다. 브라우저와 Node.js에서 같은 규칙을 실행한다.
(function(root){
  'use strict';
  const H=3600000, ms=Date.parse, clip=(x,min,max)=>Math.max(min,Math.min(max,x));
  function validate(d){
    const errors=[],maps={};
    for(const name of ['ships','ports','routes','portCalls','voyages','bookings']){
      maps[name]=new Map(d[name].map(x=>[x.id,x]));if(maps[name].size!==d[name].length)errors.push(name+' 중복 ID');
    }
    for(const s of d.ships){
      let onboard=s.initialOnboardTEU;
      const calls=d.portCalls.filter(c=>c.shipId===s.id).sort((a,b)=>a.sequence-b.sequence);
      for(const [index,c] of calls.entries()){
        if(!maps.ports.has(c.portId))errors.push(c.id+' 항구 누락');
        else if(s.draftM>maps.ports.get(c.portId).maxDraftM)errors.push(c.id+' 설정 흘수 한계 초과');
        const times=['arrival','berth','dischargeStart','dischargeEnd','loadStart','loadEnd','ready','departure'].map(k=>ms(c.planned[k]));
        if(times.some((t,i)=>!Number.isFinite(t)||(i>0&&t<times[i-1])))errors.push(c.id+' 시각 역전');
        for(const stage of ['discharge','load']){const q=c[stage];if(q.moves!==q.containers['20GP']+q.containers['40HC']||q.teu!==q.containers['20GP']+2*q.containers['40HC'])errors.push(c.id+' 컨테이너/작업회수/TEU 불일치');}
        onboard=onboard-c.discharge.teu;if(onboard<0)errors.push(c.id+' 양하량 초과');onboard+=c.load.teu;if(onboard>s.capacityTEU)errors.push(c.id+' 선복 초과');
        if(index>0){const previous=calls[index-1],v=d.voyages.find(v=>v.fromCallId===previous.id&&v.toCallId===c.id),r=v&&maps.routes.get(v.routeId);if(!v||!r||r.from!==previous.portId||r.to!==c.portId)errors.push(c.id+' 연속 항차 누락');else if(r.distanceNm/v.durationHours>s.maxSpeedKn)errors.push(v.id+' 최대 속력 초과');}
      }
    }
    for(const v of d.voyages){const from=maps.portCalls.get(v.fromCallId),to=maps.portCalls.get(v.toCallId);if(!from||!to||from.shipId!==v.shipId||to.shipId!==v.shipId||to.sequence!==from.sequence+1)errors.push(v.id+' 항차 연결 오류');else if(ms(v.departure)!==ms(from.planned.departure)||ms(v.plannedArrival)!==ms(to.planned.arrival)||Math.abs((ms(v.plannedArrival)-ms(v.departure))/H-v.durationHours)>.0001)errors.push(v.id+' 계획 항차 시각 불일치');}
    for(const o of d.observations){const c=maps.portCalls.get(o.callId);if(!c||o.completedMoves<0||o.completedMoves>c.discharge.moves||o.rateMovesPerHour<=0||ms(o.reportedAt)<ms(c.planned.dischargeStart))errors.push(o.id+' 관측값 오류');}
    for(const r of d.routes){const from=maps.ports.get(r.from),to=maps.ports.get(r.to);if(!from||!to||JSON.stringify(r.path[0])!==JSON.stringify([from.lat,from.lng])||JSON.stringify(r.path.at(-1))!==JSON.stringify([to.lat,to.lng]))errors.push(r.id+' 항로 끝점 불일치');}
    for(const b of d.bookings){const from=maps.portCalls.get(b.loadCallId),to=maps.portCalls.get(b.dischargeCallId);if(!from||!to||from.shipId!==b.shipId||to.shipId!==b.shipId||from.sequence>=to.sequence)errors.push(b.id+' 부킹 연결 오류');if(b.teu!==b.containerCount*(b.containerType.startsWith('40')?2:1))errors.push(b.id+' TEU 환산 오류');}
    for(const c of d.portCalls){if(d.bookings.filter(b=>b.loadCallId===c.id).reduce((n,b)=>n+b.teu,0)>c.load.teu)errors.push(c.id+' 부킹 선적물량 초과');}
    return errors;
  }
  function create(d){
    const by={};for(const name of ['ships','ports','routes','portCalls','voyages'])by[name]=new Map(d[name].map(x=>[x.id,x]));
    let cacheKey,cache;
    function calculate(options){
      const t=Number(options.time),mode=options.scenarioMode||'delay',override=Number(options.observedRate)||30;
      const key=[t,mode,override].join(':');if(key===cacheKey)return cache;
      const calls=new Map(),legs=new Map(),ships=new Map(),events=[];
      for(const ship of d.ships){
        const list=d.portCalls.filter(c=>c.shipId===ship.id).sort((a,b)=>a.sequence-b.sequence);let previous;
        for(const c of list){
          const p=Object.fromEntries(Object.entries(c.planned).map(([k,v])=>[k,ms(v)]));
          const incoming=previous&&d.voyages.find(v=>v.fromCallId===previous.id&&v.toCallId===c.id);
          const arrival=incoming?previous.departure+incoming.durationHours*H:p.arrival;
          const berth=Math.max(arrival,ms(c.berthWindow));const dischargeStart=Math.max(p.dischargeStart,berth+c.setupHours*H);
          const obs=d.observations.filter(o=>o.callId===c.id&&o.stage==='discharge'&&ms(o.reportedAt)<=t).sort((a,b)=>ms(b.reportedAt)-ms(a.reportedAt))[0];
          const observed=obs&&mode!=='normal'?obs:null;
          const rate=observed?override:c.discharge.rateMovesPerHour;
          const dischargeEnd=observed?ms(observed.reportedAt)+(c.discharge.moves-observed.completedMoves)/rate*H:dischargeStart+c.discharge.moves/rate*H;
          const loadStart=dischargeEnd,loadEnd=loadStart+c.load.moves/c.load.rateMovesPerHour*H;
          const ready=Math.max(loadEnd+c.departurePreparationHours*H,ms(c.servicesReady));
          const departure=Math.max(p.departure,ready);
          const dischargeDone=observed?clip(observed.completedMoves+(t-ms(observed.reportedAt))/H*rate,0,c.discharge.moves):clip((t-dischargeStart)/H*rate,0,c.discharge.moves);
          const loadDone=clip((t-loadStart)/H*c.load.rateMovesPerHour,0,c.load.moves);
          const x={...c,plannedMs:p,arrival,berth,dischargeStart,dischargeEnd,loadStart,loadEnd,ready,departure,observed,rate,dischargeDone,loadDone,delayHours:Math.max(0,(departure-p.departure)/H),cargoDelayHours:Math.max(0,(loadEnd-p.loadEnd)/H),arrivalDelayHours:Math.max(0,(arrival-p.arrival)/H)};
          calls.set(c.id,x);
          if(incoming)legs.set(incoming.id,{...incoming,departure:previous.departure,arrival,durationHours:incoming.durationHours,delayHours:Math.max(0,(arrival-ms(incoming.plannedArrival))/H)});
          for(const [field,title] of [['arrival','입항'],['berth','접안'],['dischargeStart','하역 시작'],['dischargeEnd','하역 완료'],['loadStart','선적 시작'],['loadEnd','선적 완료'],['departure','출항']]){
            const hasNext=d.voyages.some(v=>v.fromCallId===c.id);if(field==='departure'&&!hasNext)continue;
            if(x[field]<=t)events.push({id:c.id+':'+field,at:x[field],shipId:ship.id,portId:c.portId,title:ship.name+' · '+by.ports.get(c.portId).name+' '+title,tone:'good'});
          }
          previous=x;
        }
        const shipLegs=d.voyages.filter(v=>v.shipId===ship.id).map(v=>legs.get(v.id));
        const moving=shipLegs.find(v=>v.departure<=t&&t<v.arrival);
        let call=list.map(c=>calls.get(c.id)).filter(c=>c.arrival<=t).at(-1)||calls.get(list[0].id);
        const nextLeg=shipLegs.find(v=>v.fromCallId===call.id),incomingLeg=shipLegs.find(v=>v.toCallId===call.id);
        let status,progress=null,stage=null;
        if(moving)status='운항';
        else if(t<call.arrival)status='입항 예정';
        else if(t<call.berth)status='입항 대기';
        else if(t<call.dischargeStart)status='접안 준비';
        else if(t<call.dischargeEnd){status='하역 중';stage='discharge';progress=100*call.dischargeDone/call.discharge.moves;}
        else if(t<call.loadEnd){status='선적 중';stage='load';progress=100*call.loadDone/call.load.moves;}
        else if(t<call.ready)status='출항 준비';
        else status=nextLeg?'출항 대기':'다음 일정 미등록';
        const chosen=moving||nextLeg||incomingLeg||shipLegs[0];
        ships.set(ship.id,{ship,call,moving,nextLeg,v:by.voyages.get(chosen.id),leg:chosen,status,stage,progress});
      }
      const bookings=d.bookings.map(b=>{
        const load=calls.get(b.loadCallId),destination=calls.get(b.dischargeCallId),lateness=Math.max(0,(destination.arrival-ms(b.promisedArrival))/H);
        return {...b,load,destination,eta:destination.arrival,delayHours:destination.arrivalDelayHours,lateHours:lateness,impacted:lateness>0.0001,status:t<load.loadStart?'선적 예정':t<load.loadEnd?'선적 중':t<destination.arrival?'운송 중':t<destination.dischargeEnd?'양하 중':'양하 완료'};
      });
      const observedCall=calls.get('PC-S06-01');
      if(observedCall?.observed)events.push({id:'OBS-OSA-01',at:ms(observedCall.observed.reportedAt),shipId:'S06',portId:'OSA',title:'오사카 작업속도 갱신 · 다음 출항 영향 확인',tone:'warn'});
      events.sort((a,b)=>b.at-a.at||a.id.localeCompare(b.id));
      const portStates=new Map(d.ports.map(p=>{
        const here=[...ships.values()].filter(s=>!s.moving&&s.call.portId===p.id&&t>=s.call.arrival);
        const waiting=here.filter(s=>s.status==='입항 대기').length,occupied=here.filter(s=>s.status!=='입항 대기'&&s.status!=='입항 예정'&&s.status!=='다음 일정 미등록').length;
        const delayed=here.some(s=>s.call.delayHours>0&&t<s.call.departure);
        return [p.id,{portId:p.id,at:new Date(t).toISOString(),status:delayed?'작업 지연':waiting?'입항 대기':'정상',waitingVessels:waiting,occupiedBerths:occupied,totalBerths:p.berths,reason:delayed?'작업 완료 예상 변경 · 후속 출항 확인':''}];
      }));
      cacheKey=key;cache={time:t,calls,legs,ships,bookings,events,portStates,observedCall};return cache;
    }
    return {calculate};
  }
  const api={create,validate};root.VoyageEngine=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
