import React from "react";
import {
  Page,
  Block,
  Navbar,
  Preloader,
  List,
  ListItem,
  ListGroup,
} from "framework7-react";
import "./style.less";
import classNames from "classnames";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";
import { Transaction } from "../../types/commonapi";
import { IApplicationStore } from "../../store/rootReducer";
import { loadTransactions } from "../../actions/transactionActions";
import { connect } from "react-redux";
import { formatDate, formatPrice } from "../../utils";
import { IcReceived, IcSent } from "../../components-ui/icons";
import OperationDetailsPopup from "./operation-details__popup";

type Props = Page.Props & {
  loading?: boolean;
  error?: any;
  transactions: Transaction[];
  loadTransactions?(): void;
};

class TransactionsPage extends React.Component<
  Props & WithTranslation,
  {
    selectedTransaction?: Transaction;
    operationDetailsPopupOpened?: boolean;
  }
> {
  constructor(props: Readonly<Props & WithTranslation>) {
    super(props);
    this.state = {
      operationDetailsPopupOpened: false,
    };
  }

  pageInitHandle = () => {
    if (!this.props.transactions.length) {
      this.props.loadTransactions();
    }
  };

  componentDidUpdate(prevProps: Props) {
    const { error } = this.props;
    if (error && error !== prevProps.error) {
      this.$f7.dialog.alert(error);
    }
  }

  transactionClickHandler = (item: Transaction) => {
    this.setState({
      selectedTransaction: item,
      operationDetailsPopupOpened: true,
    });
  };

  render() {
    const { t, loading, transactions } = this.props;
    const { selectedTransaction, operationDetailsPopupOpened } = this.state;

    return (
      <Page
        id="transactions_page"
        name="transactions-page"
        onPageInit={this.pageInitHandle}
      >
        <Navbar
          title={t("Transactions")}
          backLink={t("Back").toString()}
          noHairline
          noShadow
        />

        {loading && (
          <Block className="text-align-center">
            <Preloader />
          </Block>
        )}

        {!loading && (
          <List className="transactions" noHairlines noChevron>
            {Object.keys(transactions)
              .reverse()
              .map((key: string) => (
                <ListGroup key={key}>
                  <ListItem title={formatDate(key)} groupTitle>
                    {formatDate(key)}
                  </ListItem>
                  {transactions[key].map((item: any) => (
                    <ListItem
                      key={item.transactionUid}
                      link
                      title={getTransactionActionName(item).toString()}
                      footer={
                        /* TODO move to method */
                        (item.creditCard
                          ? item.creditCard.cardMask + " | "
                          : "") +
                        "" +
                        (item.transactionDate
                          ? formatDate(
                              item.transactionDate.toString().substr(0, 8)
                            )
                          : null)
                      }
                      onClick={() => this.transactionClickHandler(item)}
                    >
                      <div slot="media" className="image">
                        {item.transactionAmount > 0 ? (
                          <IcReceived />
                        ) : item.transactionAmount === 0 ? null : (
                          <IcSent />
                        )}
                      </div>
                      <div
                        slot="after"
                        className={classNames(
                          "amount",
                          item.transactionAmount > 0
                            ? "debit"
                            : item.transactionAmount === 0
                            ? ""
                            : "credit"
                        )}
                      >
                        {formatPrice(item.transactionAmount, item.currencyCode)}
                      </div>
                    </ListItem>
                  ))}
                </ListGroup>
              ))}
          </List>
        )}

        <OperationDetailsPopup
          opened={operationDetailsPopupOpened}
          item={selectedTransaction}
          onPopupClosed={() =>
            this.setState({ operationDetailsPopupOpened: false })
          }
        />
      </Page>
    );
  }
}

const mapStateToProps = (state: IApplicationStore) => ({
  ...state.transactionReducer,
});

const mapDispatchToProps = (dispatch: any) => ({
  loadTransactions: () => dispatch(loadTransactions(true)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation()
)(TransactionsPage);

// Helpers
function getTransactionActionName(item: Transaction) {
  // @ts-ignore
  return item.transactionActionName;
}
