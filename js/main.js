$(function(){

    FinancialYear = Backbone.Model.extend({
        defaults: function() {
            return {
                id: 2012,
                year: '2012'
            };
        },

        initialize: function(year) {
            this.id = year;

            this.months = new MonthsInYear;
            this.months.url = '/year/' + this.id + '/months';
        }
    });

    var YearLists = Backbone.Collection.extend({
        model: FinancialYear,

        localStorage: new Backbone.LocalStorage("forecast-backbone")
    });

    MonthlyFigure = Backbone.Model.extend({
        defaults: function() {
            return {
                name: '',
                // forecasted value
                projectIncome: 0,
                otherIncome: 0,
                projectCost: 0,
                otherCost: 0,
                runningCost: 0,
                fundUsed: 0,
                fundPaid: 0,
                fundAdded: 0,
                monthlyIncome: 0,
                monthlyCost: 0,
                runningProfitLost: 0,
                runningFund: 0,
                runningFundUsed: 0,
                yearlyIncome: 0,
                yearlyCost: 0,
                health: '',
                // realized value @si-todo: later loaded from db
                projectIncomeR: 0,
                otherIncomeR: 0,
                projectCostR: 0,
                otherCostR: 0,
                runningCostR: 0,
                fundUsedR: 0,
                fundPaidR: 0,
                fundAddedR: 0,
                monthlyIncomeR: 0,
                monthlyCostR: 0,
                runningProfitLostR: 0,
                runningFundR: 0,
                runningFundUsedR: 0,
                yearlyIncomeR: 0,
                yearlyCostR: 0,
                healthR: '',
                order: Months.nextOrder()
            };
        }
    });

    var MonthsInYear = Backbone.Collection.extend({
        model: MonthlyFigure,

        nextOrder: function() {
            if (!this.length) return 1;
            return this.last().get('order') + 1;
        },

        comparator: function(month) {
            return month.get('order');
        }
    });

    var MonthsView = Backbone.View.extend({

        tagName:  "div",

        template: _.template($('#month-template').html()),

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            //this.$el.toggleClass('done', this.model.get('done'));
            //this.input = this.$('.edit');
            return this;
        },

        clear: function() {
            this.model.destroy();
        }
    });

    var AppView = Backbone.View.extend({
        el: $("#forecastapp"),

        template: _.template($('#header-template').html()),

        initialize: function() {

            this.header = this.$('header');

            this.listenTo(Months, 'reset', this.addAll);
            this.listenTo(Months, 'all', this.render);

            Months.fetch();

            if(Months.length != 12) {
                Months.each(function(model) { model.destroy(); });

                this.addAll();
            }

            //Months.each(function(model) { model.destroy(); });
        },

        render: function() {
            this.header.html(this.template({year: 2013, startingPrimary: 0, startingFund: 0}));
        },

        addOne: function(month) {
            var view = new MonthsView({model: month});
            this.$("#month-list").append(view.render().el);
        },

        addAll: function() {
            Months.each(this.addOne);
        }

    });

    var App = new AppView;

    //Months.each(function(month) { month.ping() });
});
