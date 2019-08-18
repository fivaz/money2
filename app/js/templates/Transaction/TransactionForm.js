import {accountsPromise} from "../../helpers/globalAccounts";
import {categoriesPromise} from "../../helpers/globalCategories";
import {MyMoment} from "../../helpers/myMoment";
import {Transaction} from "../../models/Transaction";

export class TransactionForm {

    constructor(cb) {
        this._container = $("#form");
        this._cb = cb;
        this.accounts = ['a', 'b'];
        accountsPromise.then(accounts => this.accounts = accounts);
        categoriesPromise.then(categories => this.categories = categories);
        this.eventHandlers();
    }

    eventHandlers() {
        this._container.click(event => {
            if (event.target.id === "btn-close-modal") {
                this._close();
            } else if (event.target.id === "btn-submit") {
                if ($(event.target).closest('form')[0].checkValidity()) {
                    event.preventDefault();
                    this._submit();
                }
            }
        });
        this._container.change(event => {
            if (event.target.id === 'transaction-type') {
                const isNotTransfer = event.target.value !== 'transfer';
                $("#transaction-destination-account-id").attr('disabled', isNotTransfer);
            }
        });
    }

    template(transaction) {
        let action = 'Create';
        if (transaction.id) {
            action = 'Edit';
        }
        const types = ["spending", "income", "transfer"];
        //@formatter:off
            return `
                <div class="my-modal">
                    <div class="d-flex align-items-start">
                        <h2 class="f-1">${action} transaction</h2>
                        <button id="btn-close-modal" class="btn btn-outline-dark">X</button>
                    </div>
                    <form>
                        <input id="transaction-id" type="hidden" value="${transaction.id || ''}">
                        <div class="form-group">
                            <div>
                                <label>description</label>
                                <input id="transaction-description" class="form-control" placeholder="description" 
                                    value="${transaction.description || 'a'}">
                            </div>
                        </div>
                        <div class="form-row ">
                            <div class="col">
                                <label>type</label>
                                <select id="transaction-type" class="form-control">
                                    ${types.map(type => 
                                        `<option ${transaction.type === type ? 'selected' : ''} value="${type}">${type}</option>`).join('')}
                                </select>
                            </div>
                            <div class="col">
                                <label>value</label>
                                <input id="transaction-value" class="form-control" value="${transaction.value || '222'}">
                            </div>
                        </div>
                        <div class="form-row form-group">
                            <div class="col">
                                <label>category</label>
                                <select id="transaction-category-id" class="form-control">
                                    ${this.categories.map(category => 
                                        `<option ${transaction.categoryId == category.id ? 'selected' : ''} value="${category.id}">${category.name}</option>`).join('')}
                                </select>
                            </div>
                            <div class="col">
                                <label>date</label>
                                <input id="transaction-date" class="form-control" type="date" value="${MyMoment.now()}">
                            </div>
                        </div>
                        <div class="form-row form-group">
                            <div class="col">
                                <label>source account</label>
                                <select id="transaction-source-account-id" class="form-control">
                                    ${this.accounts.map(account => 
                                        `<option ${transaction.sourceAccountId == account.id ? 'selected' : ''} 
                                            value="${account.id}">${account.name}</option>`).join('')}
                                </select>
                            </div>
                            <div class="col">
                                <label>destination account</label>
                                <select id="transaction-destination-account-id" class="form-control" 
                                    ${transaction.type && transaction.type === 'transfer' ? '' : 'disabled'}>
                                    ${this.accounts.map(account => 
                                        `<option ${transaction.destinationAccountId == account.id ? 'selected' : ''} 
                                            value="${account.id}">${account.name}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                        <div class="form-row form-group">
                            <button id="btn-submit" class="btn-lg btn-block btn-success d-block m-auto">${action}</button>
                        </div>
                    </form>
                </div>
            `;
        //@formatter:on

        // template.slcType.addEventListener("change", () =>
        //     template.slcAccountDestiny.disabled = (template.slcType.value !== "transfer"));
    }

    static manageDestinationAccount() {
        console.log("aaa");
    }

    open(object = {}) {
        this._container.html(this.template(object));
        $('body').css('overflow', 'hidden');
    }

    _close() {
        this._container.html('');
        $('body').css('overflow', 'auto');
    }

    static buildModel() {
        const id = $("#transaction-id").val();
        const description = $("#transaction-description").val();
        const type = $("#transaction-type").val();
        const value = $("#transaction-value").val();
        const categoryId = $("#transaction-category-id").val();
        const date = $("#transaction-date").val();
        const sourceAccountId = $("#transaction-source-account-id").val();
        let destinationAccountId = null;
        if (type === 'transfer')
            destinationAccountId = $("#transaction-destination-account-id").val();

        return new Transaction(id, description, type, value, categoryId, date, sourceAccountId, destinationAccountId);
    }

    _submit() {
        const object = TransactionForm.buildModel();
        if (object.id)
            this._update(object);
        else
            this._create(object);
    }

    _create(object) {
        object.create().then(newObject => {
            console.log(newObject);
            this._cb(newObject);
            this._close();
        });
    }

    _update(object) {
        object.save().then(() => {
            console.log(object);
            this._cb(object);
            this._close();
        });
    }
}