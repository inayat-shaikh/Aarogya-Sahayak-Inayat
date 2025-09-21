import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, Book, Phone, Mail } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const HelpPage = () => {
  const { t } = useLanguage();
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gov-navy mb-2">{t("help_support")}</h1>
        <p className="text-muted-foreground">{t("get_help_platform")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="w-5 h-5 text-blue-500" />
              {t("user_guide")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{t("learn_platform_features")}</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• {t("how_register_login")}</li>
              <li>• {t("managing_health_data")}</li>
              <li>• {t("booking_appointments")}</li>
              <li>• {t("using_medication_reminders")}</li>
              <li>• {t("viewing_reports_analytics")}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-green-500" />
              {t("frequently_asked_questions")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{t("common_questions_answers")}</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• {t("how_reset_password")}</li>
              <li>• {t("how_update_profile")}</li>
              <li>• {t("how_export_health_data")}</li>
              <li>• {t("how_contact_doctor")}</li>
              <li>• {t("how_change_language")}</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-orange-500" />
              {t("contact_support")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-2">{t("need_immediate_assistance")}</p>
            <p className="font-medium">{t("helpline")}</p>
            <p className="text-sm text-muted-foreground">{t("available_24_7")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-500" />
              {t("email_support")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-2">{t("send_queries")}</p>
            <p className="font-medium">{t("support_email")}</p>
            <p className="text-sm text-muted-foreground">{t("respond_24_hours")}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpPage;
