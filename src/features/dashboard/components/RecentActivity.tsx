import { CalendarDays, CheckCircle, Clock, PlayCircle } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ActivityItem {
  id: string;
  type: "simulation" | "persona" | "analysis";
  title: string;
  description: string;
  timestamp: Date;
  status: "completed" | "running" | "pending";
  user?: {
    name: string;
    avatar?: string;
  };
}

export const RecentActivity = () => {
  const activities: ActivityItem[] = [
    {
      id: "1",
      type: "simulation",
      title: "Customer Behavior Analysis",
      description: "A/B test simulation completed with 92% accuracy",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "completed",
      user: {
        name: "John Doe",
        avatar: "/avatars/john.jpg",
      },
    },
    {
      id: "2",
      type: "persona",
      title: "New Persona Created",
      description: "Tech-savvy millennial persona added to library",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: "completed",
      user: {
        name: "Jane Smith",
        avatar: "/avatars/jane.jpg",
      },
    },
    {
      id: "3",
      type: "simulation",
      title: "Market Trend Prediction",
      description: "Running quarterly market analysis simulation",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: "running",
      user: {
        name: "Mike Johnson",
        avatar: "/avatars/mike.jpg",
      },
    },
  ];

  const getStatusIcon = (status: ActivityItem["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "running":
        return <PlayCircle className="h-4 w-4 text-blue-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: ActivityItem["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-700";
      case "running":
        return "text-blue-700";
      case "pending":
        return "text-yellow-700";
      default:
        return "text-gray-700";
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ago`;
    }
    return `${minutes}m ago`;
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="hover:bg-muted/30 flex items-start space-x-4 rounded-lg border p-4 transition-colors"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={activity.user?.avatar}
                alt={activity.user?.name}
              />
              <AvatarFallback>
                {activity.user?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="leading-none font-medium">{activity.title}</h4>
                <div className="flex items-center gap-2">
                  {getStatusIcon(activity.status)}
                  <span className="text-muted-foreground text-xs">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                </div>
              </div>

              <p className="text-muted-foreground text-sm">
                {activity.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs">
                  by {activity.user?.name}
                </span>
                <span
                  className={`text-xs font-medium ${getStatusColor(activity.status)}`}
                >
                  {activity.status.charAt(0).toUpperCase() +
                    activity.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
