import React, { useEffect, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import axios from "axios";

function AnalyticsPieChart(props) {
	const [analytics, setAnalytics] = useState([]);
	const [views, setViews] = useState(0);
	const [likes, setLikes] = useState(0);
	const [dislikes, setDislikes] = useState(0);
	const analyticsAPI = "/api/analytics";

// Fetch all posts on component load
	useEffect(() => {
		const fetchAnalytics = async () => {
			try {
				const response = await axios.get(analyticsAPI);
				setAnalytics(response.data);
			} catch (error) {
				console.error("Error fetching analytics:", error);
			}
		};
		fetchAnalytics();
	}, []);

	return (
		<>
		</>
	);
}

export default AnalyticsPieChart;
