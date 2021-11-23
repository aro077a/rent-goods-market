import React from "react";
import { CardContent, Badge, Link, Card } from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";
import { IcCopy, IcStripe } from "../../components-ui/icons";
import { AccountPayoutSettings } from "../../types/commonapi";

type Props = WithTranslation & {
  settings?: AccountPayoutSettings;
  onRenewExternalAccountUrl?(): void;
  onCopyExternalAccountUrl?(): void;
};

const getExternalAccountStatus = (status: string) => {
  switch (status) {
    case "NEW":
      return "Not Verified";
    case "PEN":
      return "Pending";
    case "ACT":
      return "Verified";
    case "UNK":
      return "Rejected";
    default:
      return status;
  }
};

const StripeCard = ({
  settings,
  onRenewExternalAccountUrl,
  onCopyExternalAccountUrl,
  t,
}: Props) => (
  <Card noShadow className="stripe-card">
    <CardContent>
      <div className="stripe-icon">
        <IcStripe />
        {settings.externalAccount && settings.externalAccount.status && (
          <Badge
            className={`external-account-status external-account-status-${settings.externalAccount.status}`}
          >
            {t(getExternalAccountStatus(settings.externalAccount.status))}
          </Badge>
        )}
      </div>

      {settings.externalAccount && settings.externalAccount.status == "NEW" && (
        <p>
          {t(
            "To use Stripe you need an active Stripe account and to complete the setup for the payment method. To active your account tap to the link:"
          )}
        </p>
      )}

      {settings.externalAccount && settings.externalAccount.status != "NEW" && (
        <p>
          {t(
            "Payout will be done using Stripe services as to connected account."
          )}
        </p>
      )}

      {settings.externalAccount && settings.externalAccount.url && (
        <div className="external-account-url">
          <span>
            <Link href={settings.externalAccount.url} target="_blank" external>
              {settings.externalAccount.url}
            </Link>
          </span>

          <div className="external-account-url-actions">
            {onRenewExternalAccountUrl && (
              <Link
                className="renew-url"
                iconOnly
                onClick={onRenewExternalAccountUrl}
                iconMaterial="autorenew"
              />
            )}
            {onCopyExternalAccountUrl && (
              <Link
                className="copy-url"
                iconOnly
                onClick={onCopyExternalAccountUrl}
              >
                <IcCopy />
              </Link>
            )}
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);

export default compose(withTranslation())(StripeCard);
