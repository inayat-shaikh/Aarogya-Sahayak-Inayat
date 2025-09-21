import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Building2 } from "lucide-react";
import maharashtraMap from "@/assets/india-map-maharashtra.jpg";
import { useLanguage } from "@/hooks/useLanguage";

const DistrictReach = () => {
  const { t } = useLanguage();

  const stats = [
    {
      icon: MapPin,
      number: "28",
      label: "Districts Covered",
      color: "text-primary"
    },
    {
      icon: Users,
      number: "10K+",
      label: "Villages Reached",
      color: "text-secondary"
    },
    {
      icon: Building2,
      number: "500+",
      label: "Health Centers",
      color: "text-accent"
    }
  ];

  return (
    <section className="py-16 bg-gradient-feature">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {t("district_reach_title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t("district_reach_description")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Map Section */}
          <div className="relative">
            <Card className="border-0 shadow-elevated overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={maharashtraMap} 
                    alt="India map with Maharashtra highlighted" 
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{t("maharashtra_focus")}</h3>
                    <p className="text-sm opacity-90">{t("primary_coverage_area")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="space-y-6">
            {stats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-card hover:shadow-elevated transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center">
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                    <div>
                      <div className={`text-3xl font-bold ${stat.color}`}>{stat.number}</div>
                      <div className="text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="mt-8">
              <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
                {t("view_detailed_coverage")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DistrictReach;