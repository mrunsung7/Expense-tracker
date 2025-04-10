from flask import request, jsonify
from models import db, User, Expense, Category, Budget
from datetime import datetime


def init_routes(app):
    @app.route('/')
    def index():
        return jsonify({"message": "Expense Tracker API Running"})

    @app.route('/add_user', methods=['POST'])
    def add_user():
        name = request.json['name']
        user = User(name=name)
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "User added"})

    @app.route('/add_category', methods=['POST'])
    def add_category():
        name = request.json['name']
        category = Category(name=name)
        db.session.add(category)
        db.session.commit()
        return jsonify({"message": "Category added"})

    @app.route('/add_expense', methods=['POST'])
    def add_expense():
        data = request.json
        expense = Expense(**data)
        db.session.add(expense)
        db.session.commit()
        return jsonify({"message": "Expense added"})

    @app.route('/set_budget', methods=['POST'])
    def set_budget():
        data = request.json
        budget = Budget(**data)
        db.session.add(budget)
        db.session.commit()
        return jsonify({"message": "Budget set"})

    @app.route('/report/<int:user_id>/<string:month>', methods=['GET'])
    def get_report(user_id, month):
        user = User.query.get(user_id)
        expenses = Expense.query.filter_by(user_id=user_id).all()
        filtered_expenses = [
            e for e in expenses
            if datetime.strptime(e.date, "%Y-%m-%d").strftime("%B") == month
        ]
        total = sum(e.amount for e in filtered_expenses)

        budget = Budget.query.filter_by(user_id=user_id, month=month).first()

        return jsonify({
            "total_spent": total,
            "budget": budget.amount if budget else None
        })

    @app.route('/breakdown/<int:user_id>/<string:month>', methods=['GET'])
    def category_breakdown(user_id, month):
        from collections import defaultdict

        expenses = Expense.query.filter_by(user_id=user_id).all()
        breakdown = defaultdict(float)

        for e in expenses:
            if datetime.strptime(e.date, "%Y-%m-%d").strftime("%B") == month:
                category = Category.query.get(e.category_id)
                breakdown[category.name] += e.amount

        return jsonify(breakdown)

    @app.route('/expenses/<int:user_id>/<string:month>', methods=['GET'])
    def get_expense_list(user_id, month):
        expenses = Expense.query.filter_by(user_id=user_id).all()
        filtered = []
        for e in expenses:
            if datetime.strptime(e.date, "%Y-%m-%d").strftime("%B") == month:
                category = Category.query.get(e.category_id)
                filtered.append({
                    "date": e.date,
                    "amount": e.amount,
                    "category": category.name if category else "Unknown"
                })

        return jsonify(filtered)

    @app.route('/create_user', methods=['POST'])
    def create_user():
        data = request.json
        name = data.get('name')
        email = data.get('email')

        if not name or not email:
            return jsonify({"error": "Name and email required"}), 400

        if User.query.filter_by(name=name).first():
            return jsonify({"error": "User already exists"}), 400

        user = User(name=name, email=email)
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "User created"})

    @app.route('/users', methods=['GET'])
    def get_users():
        users = User.query.all()
        return jsonify([{"id": u.id, "name": u.name} for u in users])

    @app.route('/delete_user/<int:user_id>', methods=['DELETE'])
    def delete_user(user_id):
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found"}), 404

        Expense.query.filter_by(user_id=user_id).delete()
        Budget.query.filter_by(user_id=user_id).delete()

        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": f"User {user.name} deleted!"})

    @app.route('/categories', methods=['GET'])
    def get_categories():
        categories = Category.query.all()
        return jsonify([{"id": c.id, "name": c.name} for c in categories])