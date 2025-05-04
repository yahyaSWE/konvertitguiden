import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Tooltip 
} from "recharts";
import { Monitor } from "lucide-react";

type TimePeriod = "Week" | "Month" | "Year";

export function LearningActivity() {
  const [period, setPeriod] = useState<TimePeriod>("Week");
  const { user } = useAuth();

  // This would typically come from an API call based on the selected period
  const weeklyData = [
    { day: "Mån", hours: 1.5 },
    { day: "Tis", hours: 0.7 },
    { day: "Ons", hours: 2.3 },
    { day: "Tor", hours: 0.8 },
    { day: "Fre", hours: 1.2 },
    { day: "Lör", hours: 3.1 },
    { day: "Sön", hours: 2.1 },
  ];

  // Sample stats - in a real application, these would come from the API
  const weeklyStats = {
    totalTime: "12h 45m",
    completedLessons: "24/30",
    quizPerformance: "85%",
    topSubject: {
      name: "Web Development",
      hours: "6.5"
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-poppins font-semibold text-textColor">Din lärandeaktivitet</h2>
        <div className="flex space-x-2">
          <button 
            className={`tab-button px-3 py-1 text-sm font-medium ${period === 'Week' ? 'active text-primary' : 'text-gray-500'} border-b-2 border-transparent`}
            onClick={() => setPeriod("Week")}
          >
            Vecka
          </button>
          <button 
            className={`tab-button px-3 py-1 text-sm font-medium ${period === 'Month' ? 'active text-primary' : 'text-gray-500'} border-b-2 border-transparent`}
            onClick={() => setPeriod("Month")}
          >
            Månad
          </button>
          <button 
            className={`tab-button px-3 py-1 text-sm font-medium ${period === 'Year' ? 'active text-primary' : 'text-gray-500'} border-b-2 border-transparent`}
            onClick={() => setPeriod("Year")}
          >
            År
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 mb-6 md:mb-0">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} timmar`, "Använd tid"]} />
                  <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="md:w-72 md:ml-6">
            <h3 className="text-md font-medium text-textColor mb-4">Veckans statistik</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Total inlärningstid</span>
                  <span className="text-sm font-medium text-textColor">{weeklyStats.totalTime}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-value" style={{ width: "85%" }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Avslutade lektioner</span>
                  <span className="text-sm font-medium text-textColor">{weeklyStats.completedLessons}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-value" style={{ width: "80%" }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Resultat på quiz</span>
                  <span className="text-sm font-medium text-textColor">{weeklyStats.quizPerformance}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-value" style={{ width: "85%" }}></div>
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="text-md font-medium text-textColor mb-3">Främsta ämne</h3>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Monitor className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-textColor text-sm">{weeklyStats.topSubject.name}</p>
                    <p className="text-xs text-gray-500">{weeklyStats.topSubject.hours} timmar denna vecka</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
