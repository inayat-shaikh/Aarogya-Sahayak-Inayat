import { AlertTriangle, MapPin, Users, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";

const ProblemStatement = () => {
  const { t } = useLanguage();
  
  const challenges = [
    {
      icon: MapPin,
      title: t("distance_barriers_title"),
      description: t("distance_barriers_description"),
      stat: t("distance_barriers_stat"),
      statLabel: t("distance_barriers_stat_label")
    },
    {
      icon: Users,
      title: t("specialist_shortage_title"),
      description: t("specialist_shortage_description"),
      stat: t("specialist_shortage_stat"),
      statLabel: t("specialist_shortage_stat_label")
    },
    {
      icon: Clock,
      title: t("delayed_diagnosis_title"),
      description: t("delayed_diagnosis_description"),
      stat: t("delayed_diagnosis_stat"),
      statLabel: t("delayed_diagnosis_stat_label")
    }
  ];

  return (
    <section className="py-16 bg-gradient-feature">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-full mb-4">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">{t("problem_statement_alert")}</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {t("problem_statement_title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t("problem_statement_description")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {challenges.map((challenge, index) => (
            <Card key={index} className="border-0 shadow-card hover:shadow-elevated transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <challenge.icon className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{challenge.title}</h3>
                <p className="text-muted-foreground mb-4">{challenge.description}</p>
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-destructive">{challenge.stat}</div>
                  <div className="text-sm text-muted-foreground">{challenge.statLabel}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Solution approach */}
        <div className="bg-white rounded-xl p-8 shadow-card">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              {t("solution_title")}
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("solution_description")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemStatement;