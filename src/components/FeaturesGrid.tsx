import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Globe, 
  Activity, 
  Bell, 
  BookOpen, 
  ArrowRight 
} from "lucide-react";
import ashaWorkersImg from "@/assets/asha-workers.jpg";
import multilingualIcon from "@/assets/multilingual-icon.jpg";
import mobileHealthApp from "@/assets/mobile-health-app.jpg";
import healthyFood from "@/assets/healthy-indian-food.jpg";
import { useLanguage } from "@/hooks/useLanguage";

const FeaturesGrid = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: Users,
      title: t("health_worker_connect_title"),
      description: t("health_worker_connect_description"),
      color: "bg-primary",
      bgColor: "bg-primary/10",
      image: ashaWorkersImg
    },
    {
      icon: Globe,
      title: t("multilingual_interface_title"),
      description: t("multilingual_interface_description"),
      color: "bg-secondary",
      bgColor: "bg-secondary/10",
      image: multilingualIcon
    },
    {
      icon: Activity,
      title: t("daily_vitals_logging_title"),
      description: t("daily_vitals_logging_description"),
      color: "bg-gov-teal",
      bgColor: "bg-gov-teal/10",
      image: mobileHealthApp
    },
    {
      icon: Bell,
      title: t("automated_reminders_title"),
      description: t("automated_reminders_description"),
      color: "bg-accent",
      bgColor: "bg-accent/10"
    },
    {
      icon: BookOpen,
      title: t("personalized_health_feed_title"),
      description: t("personalized_health_feed_description"),
      color: "bg-gov-navy",
      bgColor: "bg-gov-navy/10",
      image: healthyFood
    },
    {
      icon: Activity,
      title: t("health_analytics_title"),
      description: t("health_analytics_description"),
      color: "bg-destructive",
      bgColor: "bg-destructive/10"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {t("features_title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t("features_description")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-0 shadow-card hover:shadow-elevated transition-all duration-300 group cursor-pointer"
            >
              <CardContent className="p-6">
                {feature.image ? (
                  <div className="relative mb-4 overflow-hidden rounded-xl">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className={`absolute inset-0 ${feature.bgColor} bg-opacity-90 flex items-center justify-center`}>
                      <feature.icon className={`w-8 h-8 ${feature.color.replace('bg-', 'text-')}`} />
                    </div>
                  </div>
                ) : (
                  <div className={`w-16 h-16 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-8 h-8 ${feature.color.replace('bg-', 'text-')}`} />
                  </div>
                )}
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <Button 
                  variant="ghost" 
                  className="p-0 h-auto text-primary hover:text-primary/80 font-medium group"
                >
                  {t("learn_more_button")}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <Button size="lg" className="bg-primary hover:bg-primary/90 px-8">
            {t("explore_all_features_button")}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;