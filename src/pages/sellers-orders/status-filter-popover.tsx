import React from "react";
import {
  Popover,
  F7Popover,
  List,
  ListItem,
  Row,
  Col,
  Block,
  Button,
  PageContent,
} from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";

type Props = WithTranslation &
  F7Popover.Props & {
    filter?: { [key: string]: string };
    selected?: string[];
    onSelect?(status: string): void;
    onClear?(): void;
    onApply?(): void;
    isSmallScreen: boolean;
    onPopoverClosed?(): void;
    selectedOrders: object;
    refreshSelectedOrdersData?(): void;
  };

const StatusFilterPopover = ({
  filter,
  selected,
  onSelect,
  onClear,
  onApply,
  isSmallScreen,
  onPopoverClosed,
  selectedOrders,
  refreshSelectedOrdersData,
  t,
  ...rest
}: Props) => {
  const count = selectedOrders.length;
  return (
    <Popover
      id="status_filter_popover"
      closeByBackdropClick={false}
      closeByOutsideClick={!isSmallScreen}
      {...rest}
    >
      {!isSmallScreen ? (
        <PageContent>
          <Block className="title">{t("Status")}</Block>
          <Block>
            <Row>
              <Col>
                <List noHairlines noHairlinesBetween>
                  <ListItem
                    checkbox
                    title={t(filter["SE"]).toString()}
                    name="status"
                    value="SE"
                    checked={selected.includes("SE")}
                    onChange={() => onSelect("SE")}
                  />
                  <ListItem
                    checkbox
                    title={t(filter["PA"]).toString()}
                    name="status"
                    value="PA"
                    checked={selected.includes("PA")}
                    onChange={() => onSelect("PA")}
                  />
                  <ListItem
                    checkbox
                    title={t(filter["PRC"]).toString()}
                    name="status"
                    value="PRC"
                    checked={selected.includes("PRC")}
                    onChange={() => onSelect("PRC")}
                  />
                  <ListItem
                    checkbox
                    title={t(filter["SHP"]).toString()}
                    name="status"
                    value="SHP"
                    checked={selected.includes("SHP")}
                    onChange={() => onSelect("SHP")}
                  />
                  <ListItem
                    checkbox
                    title={t(filter["RCV"]).toString()}
                    name="status"
                    value="RCV"
                    checked={selected.includes("RCV")}
                    onChange={() => onSelect("RCV")}
                  />
                </List>
              </Col>
              <Col>
                <List noHairlines noHairlinesBetween>
                  <ListItem
                    checkbox
                    title={t(filter["DLV"]).toString()}
                    name="status"
                    value="DLV"
                    checked={selected.includes("DLV")}
                    onChange={() => onSelect("DLV")}
                  />
                  <ListItem
                    checkbox
                    title={t(filter["CA"]).toString()}
                    name="status"
                    value="CA"
                    checked={selected.includes("CA")}
                    onChange={() => onSelect("CA")}
                  />
                  <ListItem
                    checkbox
                    title={t(filter["RF"]).toString()}
                    name="status"
                    value="RF"
                    checked={selected.includes("RF")}
                    onChange={() => onSelect("RF")}
                  />
                  <ListItem
                    checkbox
                    title={t(filter["RP"]).toString()}
                    name="status"
                    value="RP"
                    checked={selected.includes("RP")}
                    onChange={() => onSelect("RP")}
                  />
                </List>
              </Col>
            </Row>
          </Block>
          <Block className="actions">
            <Row>
              <Col>
                {selected.length > 0 && (
                  <Button
                    round
                    iconMaterial="clear"
                    text={t("Clear all")}
                    onClick={onClear}
                    popoverClose
                  />
                )}
              </Col>
              <Col>
                <Button
                  round
                  fill
                  disabled={selected.length === 0}
                  text={t("Apply")}
                  onClick={onApply}
                  popoverClose
                />
              </Col>
            </Row>
          </Block>
        </PageContent>
      ) : (
        <PageContent>
          <Block className="title">{t("Order Status")}</Block>
          <Block>
            <Row>
              <Col>
                <List noHairlines noHairlinesBetween>
                  <ListItem
                    checkbox
                    className={selected.includes("SE") && "checked"}
                    title={t(filter["SE"]).toString()}
                    name="status"
                    value="SE"
                    checked={selected.includes("SE")}
                    onChange={() => {
                      onSelect("SE");
                      refreshSelectedOrdersData();
                    }}
                  />
                  <ListItem
                    checkbox
                    className={selected.includes("PA") && "checked"}
                    title={t(filter["PA"]).toString()}
                    name="status"
                    value="PA"
                    checked={selected.includes("PA")}
                    onChange={() => {
                      refreshSelectedOrdersData();
                      onSelect("PA");
                    }}
                  />
                  <ListItem
                    checkbox
                    className={selected.includes("PRC") && "checked"}
                    title={t(filter["PRC"]).toString()}
                    name="status"
                    value="PRC"
                    checked={selected.includes("PRC")}
                    onChange={() => {
                      refreshSelectedOrdersData();
                      onSelect("PRC");
                    }}
                  />
                  <ListItem
                    checkbox
                    className={selected.includes("SHP") && "checked"}
                    title={t(filter["SHP"]).toString()}
                    name="status"
                    value="SHP"
                    checked={selected.includes("SHP")}
                    onChange={() => {
                      refreshSelectedOrdersData();
                      onSelect("SHP");
                    }}
                  />
                  <ListItem
                    checkbox
                    className={selected.includes("RCV") && "checked"}
                    title={t(filter["RCV"]).toString()}
                    name="status"
                    value="RCV"
                    checked={selected.includes("RCV")}
                    onChange={() => {
                      refreshSelectedOrdersData();
                      onSelect("RCV");
                    }}
                  />
                  <ListItem
                    checkbox
                    className={selected.includes("DLV") && "checked"}
                    title={t(filter["DLV"]).toString()}
                    name="status"
                    value="DLV"
                    checked={selected.includes("DLV")}
                    onChange={() => {
                      refreshSelectedOrdersData();
                      onSelect("DLV");
                    }}
                  />
                  <ListItem
                    checkbox
                    className={selected.includes("CA") && "checked"}
                    title={t(filter["CA"]).toString()}
                    name="status"
                    value="CA"
                    checked={selected.includes("CA")}
                    onChange={() => {
                      refreshSelectedOrdersData();
                      onSelect("CA");
                    }}
                  />
                  <ListItem
                    checkbox
                    className={selected.includes("RF") && "checked"}
                    title={t(filter["RF"]).toString()}
                    name="status"
                    value="RF"
                    checked={selected.includes("RF")}
                    onChange={() => {
                      refreshSelectedOrdersData();
                      onSelect("RF");
                    }}
                  />
                  <ListItem
                    checkbox
                    className={selected.includes("RP") && "checked"}
                    title={t(filter["RP"]).toString()}
                    name="status"
                    value="RP"
                    checked={selected.includes("RP")}
                    onChange={() => {
                      refreshSelectedOrdersData();
                      onSelect("RP");
                    }}
                  />
                </List>
              </Col>
            </Row>
          </Block>
          <Block className="actions">
            <Row>
              <Col>
                {selected.length > 0 && (
                  <Button
                    round
                    fill
                    text={t(`Show {{count}} Orders`, { count })}
                    onClick={() => {
                      onApply();
                      onPopoverClosed();
                    }}
                  />
                )}
              </Col>
            </Row>
          </Block>
        </PageContent>
      )}
    </Popover>
  );
};

export default compose(withTranslation())(StatusFilterPopover);
