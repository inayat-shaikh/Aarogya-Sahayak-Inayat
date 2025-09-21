import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Bell } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const NewsSection = () => {
  const { t } = useLanguage();
  const notifications = [
    {
      date: "20",
      month: "Sep",
      year: "2025",
      title: "New ASHA Worker Training Program Launched",
      description: "Comprehensive training modules now available for health workers across rural districts.",
      type: "notification",
      bgColor: "bg-accent"
    }
  ];

  const news = [
    {
      date: "18",
      month: "Sep", 
      year: "2025",
      title: "Rural Health Initiative Reaches 500+ Villages",
      description: "Aarogya Sahayak platform successfully connects health workers with communities across multiple states.",
      type: "news",
      bgColor: "bg-secondary"
    }
  ];

  const calendar = [
    {
      date: "25/09/2025",
      title: "World Health Day Awareness Campaign",
      subtitle: "Community Health Drive",
      events: [
        "Free Health Check-ups",
        "Diabetes Screening",
        "Blood Pressure Monitoring"
      ],
      bgColor: "bg-primary"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {t("news_section_title")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("news_section_description")}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Notifications */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </h3>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            {notifications.map((item, index) => (
              <Card key={index} className="border-0 shadow-card mb-4">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className={`${item.bgColor} text-white p-4 flex flex-col items-center justify-center min-w-[80px]`}>
                      <div className="text-2xl font-bold">{item.date}</div>
                      <div className="text-sm opacity-90">{item.month}</div>
                      <div className="text-xs opacity-75">{item.year}</div>
                    </div>
                    <div className="p-4 flex-1">
                      <h4 className="font-semibold text-foreground mb-2 line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {item.description}
                      </p>
                      <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-primary">
                        Read More <ArrowRight className="ml-1 w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Weekly News */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">Weekly News</h3>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            {news.map((item, index) => (
              <Card key={index} className="border-0 shadow-card mb-4">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className={`${item.bgColor} text-white p-4 flex flex-col items-center justify-center min-w-[80px]`}>
                      <div className="text-2xl font-bold">{item.date}</div>
                      <div className="text-sm opacity-90">{item.month}</div>
                      <div className="text-xs opacity-75">{item.year}</div>
                    </div>
                    <div className="p-4 flex-1">
                      <h4 className="font-semibold text-foreground mb-2 line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {item.description}
                      </p>
                      <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-primary">
                        Read More <ArrowRight className="ml-1 w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Health Calendar */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Health Calendar
              </h3>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            {calendar.map((item, index) => (
              <Card key={index} className="border-0 shadow-card">
                <CardContent className="p-0">
                  <div className={`${item.bgColor} text-white p-4 text-center`}>
                    <div className="text-sm opacity-90 mb-1">{item.date}</div>
                    <div className="font-semibold mb-1">{item.title}</div>
                    <div className="text-sm opacity-90">{item.subtitle}</div>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-2">
                      {item.events.map((event, eventIndex) => (
                        <li key={eventIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          {event}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;