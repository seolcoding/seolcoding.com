---
title: "JavaScript 데이터 시각화 라이브러리 비교: Chart.js vs D3.js vs Plotly.js vs ECharts"
date: 2025-01-15
draft: false
tags: ["데이터 시각화", "JavaScript", "Chart.js", "D3.js", "Plotly.js", "ECharts", "웹 개발"]
featured_image: "https://picsum.photos/seed/dataviz/1200/600"
description: "Hugo 블로그에서 4가지 인기 JavaScript 차트 라이브러리를 테스트하고 비교합니다. 실시간 인터랙티브 차트로 각 라이브러리의 장단점을 확인하세요."
---

# JavaScript 데이터 시각화 라이브러리 비교

데이터 시각화는 현대 웹 개발에서 필수적인 요소입니다. 이 글에서는 2025년 가장 인기 있는 4가지 JavaScript 차트 라이브러리를 실제로 테스트하고 비교합니다.

## 테스트 대상 라이브러리

1. **Chart.js** - 간단하고 유연한 차트 라이브러리
2. **D3.js** - 완전한 커스터마이징이 가능한 강력한 시각화 도구
3. **Plotly.js** - 과학적 데이터와 3D 시각화에 최적화
4. **ECharts** - Apache의 고성능 차트 라이브러리

## 공통 테스트 데이터

모든 라이브러리에서 동일한 데이터를 사용하여 공정한 비교를 진행합니다:

- **월별 웹사이트 방문자 수**: 1월부터 6월까지의 트렌드
- **프로그래밍 언어 인기도**: 5가지 주요 언어 비교

---

## 1. Chart.js: 초보자 친화적인 선택

Chart.js는 간단한 API와 반응형 디자인으로 유명합니다. 대시보드와 기본적인 차트가 필요한 프로젝트에 최적입니다.

### 선 그래프 (Line Chart)

<div style="max-width: 800px; margin: 20px auto;">
  <canvas id="chartjs-line"></canvas>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<script>
  const ctxLine = document.getElementById('chartjs-line');
  new Chart(ctxLine, {
    type: 'line',
    data: {
      labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
      datasets: [{
        label: '웹사이트 방문자 수',
        data: [1200, 1900, 3000, 5000, 4200, 5400],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: '월별 웹사이트 방문자 추이'
        },
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
</script>

### 막대 그래프 (Bar Chart)

<div style="max-width: 800px; margin: 20px auto;">
  <canvas id="chartjs-bar"></canvas>
</div>

<script>
  const ctxBar = document.getElementById('chartjs-bar');
  new Chart(ctxBar, {
    type: 'bar',
    data: {
      labels: ['JavaScript', 'Python', 'Java', 'C++', 'Go'],
      datasets: [{
        label: '인기도 (%)',
        data: [35, 30, 20, 10, 5],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: '프로그래밍 언어별 인기도'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 40
        }
      }
    }
  });
</script>

### 파이 차트 (Pie Chart)

<div style="max-width: 600px; margin: 20px auto;">
  <canvas id="chartjs-pie"></canvas>
</div>

<script>
  const ctxPie = document.getElementById('chartjs-pie');
  new Chart(ctxPie, {
    type: 'pie',
    data: {
      labels: ['JavaScript', 'Python', 'Java', 'C++', 'Go'],
      datasets: [{
        data: [35, 30, 20, 10, 5],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)'
        ],
        borderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: '프로그래밍 언어 시장 점유율'
        },
        legend: {
          position: 'bottom'
        }
      }
    }
  });
</script>

**Chart.js 평가:**
- ✅ 간단한 API, 빠른 구현
- ✅ 반응형 디자인 기본 지원
- ⚠️ 복잡한 커스터마이징 제한적

---

## 2. D3.js: 무한한 커스터마이징의 세계

D3.js는 완전한 제어권을 원하는 개발자를 위한 최고의 선택입니다. 학습 곡선이 가파르지만, 가능성은 무한합니다.

### 인터랙티브 막대 그래프

<div id="d3-bar-chart" style="max-width: 800px; margin: 20px auto;"></div>

<script src="https://d3js.org/d3.v7.min.js"></script>
<script>
  // D3.js 막대 그래프
  const d3Data = [
    {name: 'JavaScript', value: 35},
    {name: 'Python', value: 30},
    {name: 'Java', value: 20},
    {name: 'C++', value: 10},
    {name: 'Go', value: 5}
  ];

  const d3Margin = {top: 40, right: 30, bottom: 60, left: 60};
  const d3Width = 800 - d3Margin.left - d3Margin.right;
  const d3Height = 400 - d3Margin.top - d3Margin.bottom;

  const d3Svg = d3.select("#d3-bar-chart")
    .append("svg")
    .attr("width", d3Width + d3Margin.left + d3Margin.right)
    .attr("height", d3Height + d3Margin.top + d3Margin.bottom)
    .style("background", "#f9f9f9")
    .append("g")
    .attr("transform", `translate(${d3Margin.left},${d3Margin.top})`);

  // X축
  const x = d3.scaleBand()
    .range([0, d3Width])
    .domain(d3Data.map(d => d.name))
    .padding(0.2);

  d3Svg.append("g")
    .attr("transform", `translate(0,${d3Height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", "12px");

  // Y축
  const y = d3.scaleLinear()
    .domain([0, 40])
    .range([d3Height, 0]);

  d3Svg.append("g")
    .call(d3.axisLeft(y))
    .style("font-size", "12px");

  // 막대 그래프
  d3Svg.selectAll("mybar")
    .data(d3Data)
    .enter()
    .append("rect")
    .attr("x", d => x(d.name))
    .attr("y", d => y(d.value))
    .attr("width", x.bandwidth())
    .attr("height", d => d3Height - y(d.value))
    .attr("fill", "#69b3a2")
    .attr("rx", 4)
    .on("mouseover", function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("fill", "#3d8b7d")
        .attr("opacity", 0.8);
    })
    .on("mouseout", function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("fill", "#69b3a2")
        .attr("opacity", 1);
    });

  // 제목
  d3Svg.append("text")
    .attr("x", d3Width / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("D3.js 인터랙티브 막대 그래프");
</script>

### 산점도 (Scatter Plot)

<div id="d3-scatter-chart" style="max-width: 800px; margin: 20px auto;"></div>

<script>
  // D3.js 산점도
  const scatterData = [
    {x: 10, y: 20}, {x: 15, y: 25}, {x: 20, y: 30},
    {x: 25, y: 35}, {x: 30, y: 32}, {x: 35, y: 45},
    {x: 40, y: 38}, {x: 45, y: 48}, {x: 50, y: 52}
  ];

  const scatterSvg = d3.select("#d3-scatter-chart")
    .append("svg")
    .attr("width", d3Width + d3Margin.left + d3Margin.right)
    .attr("height", d3Height + d3Margin.top + d3Margin.bottom)
    .style("background", "#f9f9f9")
    .append("g")
    .attr("transform", `translate(${d3Margin.left},${d3Margin.top})`);

  const xScatter = d3.scaleLinear()
    .domain([0, 60])
    .range([0, d3Width]);

  scatterSvg.append("g")
    .attr("transform", `translate(0,${d3Height})`)
    .call(d3.axisBottom(xScatter))
    .style("font-size", "12px");

  const yScatter = d3.scaleLinear()
    .domain([0, 60])
    .range([d3Height, 0]);

  scatterSvg.append("g")
    .call(d3.axisLeft(yScatter))
    .style("font-size", "12px");

  scatterSvg.selectAll("dot")
    .data(scatterData)
    .enter()
    .append("circle")
    .attr("cx", d => xScatter(d.x))
    .attr("cy", d => yScatter(d.y))
    .attr("r", 6)
    .style("fill", "#ff6b6b")
    .style("opacity", 0.7)
    .on("mouseover", function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("r", 10)
        .style("opacity", 1);
    })
    .on("mouseout", function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("r", 6)
        .style("opacity", 0.7);
    });

  scatterSvg.append("text")
    .attr("x", d3Width / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("D3.js 산점도 (Scatter Plot)");
</script>

**D3.js 평가:**
- ✅ 완전한 커스터마이징 가능
- ✅ 강력한 데이터 바인딩
- ⚠️ 높은 학습 곡선, 많은 코드량

---

## 3. Plotly.js: 과학적 시각화의 강자

Plotly.js는 3D 차트, 통계 그래프, 과학적 데이터 시각화에 탁월합니다. 40개 이상의 차트 타입을 지원합니다.

### 인터랙티브 선 그래프

<div id="plotly-line-chart" style="max-width: 800px; margin: 20px auto; height: 400px;"></div>

<script src="https://cdn.plot.ly/plotly-2.29.1.min.js" charset="utf-8"></script>
<script>
  const plotlyLineData = [{
    x: ['1월', '2월', '3월', '4월', '5월', '6월'],
    y: [1200, 1900, 3000, 5000, 4200, 5400],
    type: 'scatter',
    mode: 'lines+markers',
    marker: {
      color: 'rgb(142, 124, 195)',
      size: 10
    },
    line: {
      color: 'rgb(142, 124, 195)',
      width: 3
    },
    name: '방문자 수'
  }];

  const plotlyLineLayout = {
    title: 'Plotly.js 월별 방문자 추이',
    xaxis: { title: '월' },
    yaxis: { title: '방문자 수', rangemode: 'tozero' },
    hovermode: 'closest',
    plot_bgcolor: '#f9f9f9',
    paper_bgcolor: '#ffffff'
  };

  Plotly.newPlot('plotly-line-chart', plotlyLineData, plotlyLineLayout, {responsive: true});
</script>

### 3D 산점도

<div id="plotly-3d-scatter" style="max-width: 800px; margin: 20px auto; height: 500px;"></div>

<script>
  const plotly3DData = [{
    x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    y: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
    z: [10, 20, 15, 25, 30, 28, 35, 40, 38, 45],
    mode: 'markers',
    type: 'scatter3d',
    marker: {
      size: 12,
      color: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      colorscale: 'Viridis',
      showscale: true
    }
  }];

  const plotly3DLayout = {
    title: 'Plotly.js 3D 산점도',
    scene: {
      xaxis: { title: 'X 축' },
      yaxis: { title: 'Y 축' },
      zaxis: { title: 'Z 축' }
    },
    paper_bgcolor: '#ffffff'
  };

  Plotly.newPlot('plotly-3d-scatter', plotly3DData, plotly3DLayout, {responsive: true});
</script>

### 히트맵 (Heatmap)

<div id="plotly-heatmap" style="max-width: 800px; margin: 20px auto; height: 400px;"></div>

<script>
  const plotlyHeatmapData = [{
    z: [
      [1, 20, 30, 50, 80],
      [20, 1, 60, 80, 30],
      [30, 60, 1, -10, 20],
      [50, 80, -10, 1, 40],
      [80, 30, 20, 40, 1]
    ],
    x: ['JS', 'Python', 'Java', 'C++', 'Go'],
    y: ['JS', 'Python', 'Java', 'C++', 'Go'],
    type: 'heatmap',
    colorscale: 'Portland'
  }];

  const plotlyHeatmapLayout = {
    title: 'Plotly.js 언어 간 유사도 히트맵',
    xaxis: { title: '언어' },
    yaxis: { title: '언어' }
  };

  Plotly.newPlot('plotly-heatmap', plotlyHeatmapData, plotlyHeatmapLayout, {responsive: true});
</script>

**Plotly.js 평가:**
- ✅ 3D 차트와 과학적 시각화 최고
- ✅ 40개 이상의 차트 타입
- ⚠️ 파일 크기가 크고 무거움

---

## 4. ECharts: 고성능 차트의 정석

Apache의 ECharts는 대용량 데이터와 복잡한 인터랙션에서도 빠른 성능을 자랑합니다.

### 다중 축 선 그래프

<div id="echarts-line" style="max-width: 800px; margin: 20px auto; height: 400px;"></div>

<script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
<script>
  const echartsLine = echarts.init(document.getElementById('echarts-line'));
  const echartsLineOption = {
    title: {
      text: 'ECharts 월별 방문자 및 페이지뷰'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['방문자', '페이지뷰']
    },
    xAxis: {
      type: 'category',
      data: ['1월', '2월', '3월', '4월', '5월', '6월']
    },
    yAxis: [
      {
        type: 'value',
        name: '방문자',
        position: 'left'
      },
      {
        type: 'value',
        name: '페이지뷰',
        position: 'right'
      }
    ],
    series: [
      {
        name: '방문자',
        type: 'line',
        data: [1200, 1900, 3000, 5000, 4200, 5400],
        smooth: true,
        itemStyle: { color: '#5470c6' }
      },
      {
        name: '페이지뷰',
        type: 'line',
        yAxisIndex: 1,
        data: [3600, 5700, 9000, 15000, 12600, 16200],
        smooth: true,
        itemStyle: { color: '#91cc75' }
      }
    ]
  };
  echartsLine.setOption(echartsLineOption);
  window.addEventListener('resize', () => echartsLine.resize());
</script>

### 레이더 차트 (Radar Chart)

<div id="echarts-radar" style="max-width: 800px; margin: 20px auto; height: 500px;"></div>

<script>
  const echartsRadar = echarts.init(document.getElementById('echarts-radar'));
  const echartsRadarOption = {
    title: {
      text: 'ECharts 프로그래밍 언어 역량 비교'
    },
    legend: {
      data: ['개발자 A', '개발자 B']
    },
    radar: {
      indicator: [
        { name: '성능', max: 100 },
        { name: '생산성', max: 100 },
        { name: '커뮤니티', max: 100 },
        { name: '라이브러리', max: 100 },
        { name: '학습 곡선', max: 100 }
      ]
    },
    series: [{
      name: '언어 역량',
      type: 'radar',
      data: [
        {
          value: [90, 70, 95, 90, 60],
          name: '개발자 A',
          areaStyle: {
            color: 'rgba(255, 99, 132, 0.3)'
          }
        },
        {
          value: [70, 90, 85, 80, 80],
          name: '개발자 B',
          areaStyle: {
            color: 'rgba(54, 162, 235, 0.3)'
          }
        }
      ]
    }]
  };
  echartsRadar.setOption(echartsRadarOption);
  window.addEventListener('resize', () => echartsRadar.resize());
</script>

### 동적 원형 차트

<div id="echarts-pie" style="max-width: 800px; margin: 20px auto; height: 500px;"></div>

<script>
  const echartsPie = echarts.init(document.getElementById('echarts-pie'));
  const echartsPieOption = {
    title: {
      text: 'ECharts 프로그래밍 언어 시장 점유율',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}% ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '언어',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}: {c}%'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        data: [
          { value: 35, name: 'JavaScript', itemStyle: { color: '#f39c12' } },
          { value: 30, name: 'Python', itemStyle: { color: '#3498db' } },
          { value: 20, name: 'Java', itemStyle: { color: '#e74c3c' } },
          { value: 10, name: 'C++', itemStyle: { color: '#9b59b6' } },
          { value: 5, name: 'Go', itemStyle: { color: '#1abc9c' } }
        ]
      }
    ]
  };
  echartsPie.setOption(echartsPieOption);
  window.addEventListener('resize', () => echartsPie.resize());
</script>

**ECharts 평가:**
- ✅ 뛰어난 성능, 대용량 데이터 처리
- ✅ 풍부한 차트 타입과 테마
- ⚠️ 중국 커뮤니티 중심, 영문 문서 부족

---

## 비교 및 결론

| 라이브러리 | 학습 난이도 | 성능 | 커스터마이징 | 추천 용도 |
|------------|-------------|------|--------------|-----------|
| **Chart.js** | ⭐ 쉬움 | ⭐⭐⭐ 좋음 | ⭐⭐ 제한적 | 대시보드, 간단한 차트 |
| **D3.js** | ⭐⭐⭐ 어려움 | ⭐⭐⭐⭐ 우수 | ⭐⭐⭐⭐⭐ 무제한 | 커스텀 시각화, 복잡한 인터랙션 |
| **Plotly.js** | ⭐⭐ 보통 | ⭐⭐⭐ 좋음 | ⭐⭐⭐⭐ 매우 좋음 | 과학 데이터, 3D 차트 |
| **ECharts** | ⭐⭐ 보통 | ⭐⭐⭐⭐⭐ 최고 | ⭐⭐⭐⭐ 매우 좋음 | 대규모 데이터, 기업용 앱 |

### 최종 추천

- **빠른 프로토타이핑**: Chart.js
- **완전한 커스터마이징**: D3.js
- **과학/통계 데이터**: Plotly.js
- **대용량 데이터/성능**: ECharts

모든 라이브러리는 Hugo 정적 사이트에서 완벽하게 작동하며, CDN을 통해 쉽게 사용할 수 있습니다. 프로젝트의 요구사항에 맞는 라이브러리를 선택하세요!

---

## Hugo에서 사용하는 방법

Hugo의 `config.toml`에 다음 설정이 필요합니다:

```toml
[markup]
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true
```

이 설정으로 마크다운에서 HTML과 JavaScript를 직접 사용할 수 있습니다.

## 참고 자료

- [Chart.js 공식 문서](https://www.chartjs.org/docs/)
- [D3.js 공식 사이트](https://d3js.org/)
- [Plotly.js 문서](https://plotly.com/javascript/)
- [ECharts 공식 문서](https://echarts.apache.org/)

---

*이 글의 모든 차트는 실시간으로 렌더링되며, 마우스 호버와 인터랙션이 가능합니다. 각 차트를 직접 조작해보세요!*
