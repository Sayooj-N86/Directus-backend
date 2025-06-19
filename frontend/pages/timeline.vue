<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Historical Timeline</h1>
    <svg ref="svg" class="w-full h-[400px] border" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as d3 from 'd3'

// Directus API endpoint (adjust as needed)
const API_URL = 'http://localhost:8055/items/artifacts'

const svg = ref(null)

onMounted(async () => {
  const res = await fetch(API_URL)
  const { data } = await res.json()

  // Sort and parse date
  const parsedData = data
    .map(d => ({
      ...d,
      date: new Date(d.date)
    }))
    .sort((a, b) => a.date - b.date)

  drawTimeline(parsedData)
})

function drawTimeline(data) {
  const svgEl = d3.select(svg.value)
  const width = svg.value.clientWidth
  const height = svg.value.clientHeight
  svgEl.selectAll("*").remove() // Clear previous drawings

  const margin = { top: 20, right: 20, bottom: 50, left: 50 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const x = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([0, innerWidth])

  const y = d3.scalePoint()
    .domain(data.map(d => d.title))
    .range([0, innerHeight])
    .padding(1)

  const g = svgEl.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)

  g.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(x).ticks(6))

  g.append("g")
    .call(d3.axisLeft(y))

  g.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.date))
    .attr("cy", d => y(d.title))
    .attr("r", 6)
    .attr("fill", "#1e40af")
    .append("title")
    .text(d => `${d.title} — ${d.description}`)
}
</script>

<style scoped>
svg {
  background-color: #f9fafb;
}
</style>
