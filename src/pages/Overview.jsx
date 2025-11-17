import StatsCard from "../components/dashboard/StatsCard";
import UserManagement from "../components/dashboard/UserManagement";

const Overview = () => {
  const stats = [
    { title: 'Total farms', value: '29', change: 11.02 },
    { title: 'Active coops', value: '715', change: -0.03 },
    { title: 'Active alerts', value: '31', change: 15.03 },
    { title: 'Connected devices', value: '234', change: 6.08 },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* User Management Table */}
      <UserManagement />
    </div>
  );
};

export default Overview;