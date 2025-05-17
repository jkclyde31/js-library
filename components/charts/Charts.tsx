"use client"

import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export function BarChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <Bar
      options={{
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
      }}
      data={{
        labels: data.map(d => d.name),
        datasets: [
          {
            label: "Loans",
            data: data.map(d => d.value),
            backgroundColor: "rgba(59, 130, 246, 0.7)",
          },
        ],
      }}
    />
  );
}

export function PieChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <Pie
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: "right",
          },
        },
      }}
      data={{
        labels: data.map(d => d.name),
        datasets: [
          {
            data: data.map(d => d.value),
            backgroundColor: [
              "rgba(59, 130, 246, 0.7)",
              "rgba(16, 185, 129, 0.7)",
              "rgba(245, 158, 11, 0.7)",
              "rgba(139, 92, 246, 0.7)",
              "rgba(244, 63, 94, 0.7)",
            ],
          },
        ],
      }}
    />
  );
}