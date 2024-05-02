import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import Loader from '../components/loader.component';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const TableAdmin = () => {
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchChartData = () =>{
      axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/registers7days")
      .then(({data}) =>{
        const labels = data.map(item => item.date);
        const values = data.map(item => item.count);


        const newChartData = {
          labels,
          datasets: [
            {
              label: 'Number of account registrants',
              data: values,
              backgroundColor: '#ffafcc',
              borderColor: '#ffafcc',
              borderWidth: 1,
            },
          ],
        };

        setChartData(newChartData);
        setIsLoading(false);
      })
      .catch(error =>{
        setIsLoading(false); 
      })
    }

    useEffect(()=>{
        fetchChartData()
    },[])

    if (isLoading) {
      return <Loader />
    }else{
        return <Bar data={chartData} />;
    }
  
}

export default TableAdmin