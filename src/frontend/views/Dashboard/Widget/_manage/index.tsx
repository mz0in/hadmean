import {
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
  ContentLayout,
} from "@hadmean/chromista";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { IWidgetConfig } from "shared/types/dashboard";
import { useActiveEntities } from "frontend/hooks/entity/entity.store";
import { useRouteParam } from "@hadmean/protozoa";
import { SystemIconsList } from "shared/constants/Icons";
import { useNavigationStack } from "frontend/lib/routing";
import { AppLayout } from "frontend/_layouts/app";
import { DashboardWidgetForm } from "./Form";
import { useDashboardWidgets } from "../../dashboard.store";
import { DASHBOARD_WIDGETS_CRUD_CONFIG } from "../../constants";

interface IProps {
  onSave: (data: IWidgetConfig) => Promise<void>;
  action: "create" | "edit";
}

export function BaseManageDashboardWidget({ onSave, action }: IProps) {
  const dashboardId = useRouteParam("dashboardId");
  const widgetId = useRouteParam("widgetId");
  const activeEntities = useActiveEntities();
  const widgets = useDashboardWidgets(dashboardId);

  const { canGoBack, goBack, backLink } = useNavigationStack();

  let widgetValue: Partial<IWidgetConfig> = {
    icon: SystemIconsList[0],
  };

  let widgetError = "";

  if (action === "edit" && !widgets.isLoading) {
    widgetValue = widgets.data.find(({ id }) => id === widgetId);
    if (!widgetValue) {
      widgetError = `Widget with id '${widgetId}' not found`;
    }
  }

  return (
    <AppLayout>
      <ContentLayout.Center>
        <SectionBox
          title={
            action === "create"
              ? DASHBOARD_WIDGETS_CRUD_CONFIG.TEXT_LANG.CREATE
              : DASHBOARD_WIDGETS_CRUD_CONFIG.TEXT_LANG.EDIT
          }
          backLink={backLink}
        >
          <ViewStateMachine
            loading={activeEntities.isLoading}
            error={activeEntities.error || widgetError}
            loader={
              <FormSkeleton
                schema={[
                  FormSkeletonSchema.Input,
                  FormSkeletonSchema.Input,
                  FormSkeletonSchema.Input,
                  FormSkeletonSchema.Input,
                ]}
              />
            }
          >
            <DashboardWidgetForm
              entities={activeEntities.data}
              onSubmit={async (config) => {
                await onSave(config);
                if (canGoBack()) {
                  goBack();
                }
              }}
              action={action}
              initialValues={widgetValue}
            />
          </ViewStateMachine>
        </SectionBox>
      </ContentLayout.Center>
    </AppLayout>
  );
}
