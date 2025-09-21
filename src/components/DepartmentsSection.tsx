import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Users, Building, Heart, Stethoscope, Pill, BookOpen } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const DepartmentsSection = () => {
  const { t } = useLanguage();

  const partners = [
    {
      icon: Heart,
      name: "Public Health and Family Welfare",
      description: "Government health department partnership for rural healthcare initiatives",
      color: "bg-primary",
      count: "28 Districts"
    },
    {
      icon: Users,
      name: "Community Health Workers",
      description: "Network of ASHA workers and local health volunteers",
      color: "bg-secondary",
      count: "500+ Workers"
    },
    {
      icon: Stethoscope,
      name: "Medical Education Department",
      description: "Training and capacity building for healthcare professionals",
      color: "bg-gov-teal",
      count: "12 Institutes"
    },
    {
      icon: Building,
      name: "Rural Development Ministry",
      description: "Infrastructure and technology support for remote areas",
      color: "bg-accent",
      count: "15 Projects"
    },
    {
      icon: Pill,
      name: "Pharmaceutical Services",
      description: "Medicine supply chain and distribution networks",
      color: "bg-gov-navy",
      count: "200+ Centers"
    },
    {
      icon: BookOpen,
      name: "Health Information Systems",
      description: "Digital health records and data management solutions",
      color: "bg-destructive",
      count: "3 States"
    }
  ];

  const districts = [
    { name: t("konkan_division"), status: t("active"), color: "bg-green-500" },
    { name: t("pune_division"), status: t("active"), color: "bg-green-500" },
    { name: t("nashik_division"), status: t("active"), color: "bg-green-500" },
    { name: t("aurangabad_division"), status: t("active"), color: "bg-green-500" },
    { name: t("amravati_division"), status: t("active"), color: "bg-green-500" },
    { name: t("nagpur_division"), status: t("active"), color: "bg-green-500" }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Departments & Partners */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                {t("departments_partners_title")}
              </h2>
              <Button variant="outline" size="sm">
                {t("view_all")} <ExternalLink className="ml-2 w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {partners.map((partner, index) => (
                <Card key={index} className="border-0 shadow-card hover:shadow-elevated transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${partner.color.replace('bg-', 'bg-')}/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <partner.icon className={`w-6 h-6 ${partner.color.replace('bg-', 'text-')}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {partner.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {partner.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-primary">{partner.count}</div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* District/Regional Reach */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                {t("regional_reach_title")}
              </h2>
              <Button variant="outline" size="sm">
                {t("interactive_map")} <ExternalLink className="ml-2 w-4 h-4" />
              </Button>
            </div>

            {/* Districts Overview */}
            <Card className="border-0 shadow-card mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {t("districts_of_maharashtra")}
                </h3>
                <div className="space-y-3">
                  {districts.map((district, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 ${district.color} rounded-full`}></div>
                        <span className="font-medium text-foreground">{district.name}</span>
                      </div>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        district.status === t("active") 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {district.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-0 shadow-card">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">28</div>
                  <div className="text-sm text-muted-foreground">{t("districts_covered")}</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-card">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-secondary">5</div>
                  <div className="text-sm text-muted-foreground">{t("active_divisions")}</div>
                </CardContent>
              </Card>
            </div>

            {/* Interactive Map Placeholder */}
            <Card className="border-0 shadow-card mt-6">
              <CardContent className="p-6">
                <div className="bg-muted/30 rounded-lg h-48 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Building className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{t("interactive_map")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("click_to_view_detailed_coverage")}
                    </p>
                    <Button variant="outline" size="sm" className="mt-3">
                      {t("launch_map")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DepartmentsSection;