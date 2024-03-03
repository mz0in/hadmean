/* eslint-disable no-useless-escape */
import React from "react";
import { render, screen, within } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import userEvent from "@testing-library/user-event";
import { setupApiHandlers } from "__tests__/_/setupApihandlers";

import EntityFormExtensionSettings from "pages/admin/[entity]/config/form";
import { closeAllToasts } from "__tests__/_/utils/closeAllToasts";

setupApiHandlers();

describe("pages/admin/[entity]/config/form", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  useRouter.mockImplementation(() => ({
    asPath: "/",
    query: {
      entity: "entity-1",
    },
    isReady: true,
  }));

  describe.each([
    {
      section: "fieldsState",
      label: "Fields State",
      validInput: `return {{name: {{hidden: true}}`,
      valid: `return {name: {hidden: true}}`,
    },
    {
      section: "beforeSubmit",
      label: "Before Submit",
      validInput: `return {{...$.formValues, custom: "Yes"}`,
      valid: `return {...$.formValues, custom: "Yes"}`,
    },
  ])("$section section", ({ label, section, valid, validInput }) => {
    it("should show current section value", async () => {
      render(
        <ApplicationRoot>
          <EntityFormExtensionSettings />
        </ApplicationRoot>
      );

      await userEvent.click(await screen.findByRole("tab", { name: label }));

      expect(
        await within(
          screen.getByRole("tabpanel", { name: label })
        ).findByLabelText(`Script`)
      ).toHaveValue(section);
    });

    it("should update when provided value correctly", async () => {
      render(
        <ApplicationRoot>
          <EntityFormExtensionSettings />
        </ApplicationRoot>
      );

      await userEvent.click(await screen.findByRole("tab", { name: label }));

      const currentTab = screen.getByRole("tabpanel", { name: label });

      await userEvent.clear(within(currentTab).getByLabelText("Script"));

      await userEvent.type(
        within(currentTab).getByLabelText("Script"),
        validInput
      );

      await userEvent.click(
        within(currentTab).getByRole("button", { name: "Save Form Scripts" })
      );

      expect(await screen.findByRole("status")).toHaveTextContent(
        "Form Scripts Saved Successfully"
      );

      await closeAllToasts();
    });

    it("should display updated value", async () => {
      render(
        <ApplicationRoot>
          <EntityFormExtensionSettings />
        </ApplicationRoot>
      );

      await userEvent.click(await screen.findByRole("tab", { name: label }));

      const currentTab = screen.getByRole("tabpanel", { name: label });

      expect(within(currentTab).getByLabelText("Script")).toHaveValue(
        `${valid}`
      );
    });

    it("should not update when invalid JS is provided", async () => {
      render(
        <ApplicationRoot>
          <EntityFormExtensionSettings />
        </ApplicationRoot>
      );

      await userEvent.click(await screen.findByRole("tab", { name: label }));

      const currentTab = screen.getByRole("tabpanel", { name: label });

      await userEvent.type(
        within(currentTab).getByLabelText("Script"),
        "Updated"
      );

      await userEvent.click(
        within(currentTab).getByRole("button", { name: "Save Form Scripts" })
      );

      expect(await screen.findByRole("status")).toHaveTextContent(
        "Expression: •JS-Error: SyntaxError: Unexpected identifier"
      );

      await closeAllToasts();
    });

    it("should display previous section value", async () => {
      render(
        <ApplicationRoot>
          <EntityFormExtensionSettings />
        </ApplicationRoot>
      );

      await userEvent.click(await screen.findByRole("tab", { name: label }));

      const currentTab = screen.getByRole("tabpanel", { name: label });

      expect(within(currentTab).getByLabelText("Script")).toHaveValue(
        `${valid}`
      );
    });

    it("should be able to be cleared", async () => {
      render(
        <ApplicationRoot>
          <EntityFormExtensionSettings />
        </ApplicationRoot>
      );

      await userEvent.click(await screen.findByRole("tab", { name: label }));

      const currentTab = screen.getByRole("tabpanel", { name: label });

      await userEvent.clear(within(currentTab).getByLabelText("Script"));

      await userEvent.click(
        within(currentTab).getByRole("button", { name: "Save Form Scripts" })
      );

      expect(await screen.findByRole("status")).toHaveTextContent(
        "Form Scripts Saved Successfully"
      );
    });

    it("should display cleared value correctly", async () => {
      render(
        <ApplicationRoot>
          <EntityFormExtensionSettings />
        </ApplicationRoot>
      );

      await userEvent.click(await screen.findByRole("tab", { name: label }));

      const currentTab = screen.getByRole("tabpanel", { name: label });

      expect(within(currentTab).getByLabelText("Script")).toHaveValue(``);
    });
  });
});
