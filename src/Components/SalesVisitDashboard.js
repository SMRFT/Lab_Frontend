import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Box, Select, MenuItem, TextField, Card } from "@mui/material";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, RadialBarChart, RadialBar } from "recharts";
import { motion } from "framer-motion";

const SalesVisitDashboard = () => {
    const [logs, setLogs] = useState([]);
    const [salespersonVisits, setSalespersonVisits] = useState([]);
    const [totalVisits, setTotalVisits] = useState(0);
    const [salespersons, setSalespersons] = useState([]);
    const [selectedSalesperson, setSelectedSalesperson] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF6699"];

    useEffect(() => {
        fetchLogs();
    }, [selectedSalesperson, selectedMonth]);

    const fetchLogs = async () => {
        try {
            const url = "https://lab.shinovadatabase.in/SalesVisitLog/";
            const params = {};
            if (selectedSalesperson) params.salesMapping = selectedSalesperson;
            if (selectedMonth) params.date = `${selectedMonth}-01`;

            const response = await axios.get(url, { params });
            setLogs(response.data);
            processVisitData(response.data);
            extractSalespersons(response.data);
        } catch (error) {
            console.error("Error fetching logs:", error);
        }
    };

    const extractSalespersons = (data) => {
        const uniqueSalespersons = [...new Set(data.map((log) => log.salesMapping).filter(Boolean))];
        setSalespersons(uniqueSalespersons);
    };

    const processVisitData = (data) => {
        const visitCounts = {};
        let total = 0;

        data.forEach((log) => {
            const name = log.salesPersonName || "Unknown";
            const visits = parseInt(log.noOfVisits, 10) || 0;
            visitCounts[name] = (visitCounts[name] || 0) + visits;
            total += visits;
        });

        const visitData = Object.entries(visitCounts).map(([name, count]) => ({ name, count }));
        setSalespersonVisits(visitData);
        setTotalVisits(total);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
            <Typography variant="h4" align="center" gutterBottom component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                Sales Visit Dashboard
            </Typography>

            {/* Filter Container with Animation */}
            <Card component={motion.div} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} sx={{ p: 3, mb: 3, display: "flex", gap: 2, alignItems: "center", justifyContent: "center", flexWrap: "wrap", boxShadow: 3 }}>
                <Select value={selectedSalesperson} onChange={(e) => setSelectedSalesperson(e.target.value)} displayEmpty sx={{ width: 200 }}>
                    <MenuItem value="">All Salespersons</MenuItem>
                    {salespersons.map((sp) => (
                        <MenuItem key={sp} value={sp}>
                            {sp}
                        </MenuItem>
                    ))}
                </Select>
                <TextField type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} sx={{ width: 200 }} />
            </Card>

            <Typography variant="h6" align="center" gutterBottom component={motion.div} initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
                Total Visits: {totalVisits}
            </Typography>

            <Box display="flex" flexWrap="wrap" justifyContent="center" gap={4}>
                {/* Pie Chart */}
                <Box sx={{ width: 400, height: 400 }} component={motion.div} initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
                    <Typography variant="h6" align="center">
                        Visits by Salesperson (Pie Chart)
                    </Typography>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={salespersonVisits} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                {salespersonVisits.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Box>

                {/* Bar Chart */}
                <Box sx={{ width: 600, height: 400 }} component={motion.div} initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
                    <Typography variant="h6" align="center">
                        Visits by Salesperson (Bar Chart)
                    </Typography>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salespersonVisits}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>

                {/* Line Chart */}
                <Box sx={{ width: 600, height: 400 }} component={motion.div} initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
                    <Typography variant="h6" align="center">
                        Monthly Visit Trends (Line Chart)
                    </Typography>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={salespersonVisits}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="count" stroke="#ff7300" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>

                {/* Radial Bar Chart */}
                <Box sx={{ width: 400, height: 400 }} component={motion.div} initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
                    <Typography variant="h6" align="center">
                        Visits Breakdown (Radial Bar Chart)
                    </Typography>
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart innerRadius="10%" outerRadius="90%" data={salespersonVisits} startAngle={180} endAngle={0}>
                            <RadialBar minAngle={15} label={{ position: "insideStart", fill: "#fff" }} background clockWise dataKey="count" />
                            <Tooltip />
                        </RadialBarChart>
                    </ResponsiveContainer>
                </Box>
            </Box>
        </Container>
    );
};

export default SalesVisitDashboard;
