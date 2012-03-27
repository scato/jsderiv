var cst = require('./ecmascript5');
var ast = require('./ecmascript5-ast');

var generic = require('../../lib/generic');
var lexer = new cst.Lexical();

cst.PrimaryExpression.prototype.toAST = function() {
    if(this.value[0] === 'this') {
        return ast.This();
    } else if(typeof this.value[0] === 'string' && generic.match(lexer.Identifier(), this.value[0])) {
        return ast.Identifier(this.value[0]);
    } else if(typeof this.value[0] === 'string' && generic.match(lexer.Literal(), this.value[0])) {
        return ast.Literal(this.value[0]);
    } else if(this.value[0] instanceof cst.ArrayLiteral) {
        return this.value[0].toAST();
    } else if(this.value[0] instanceof cst.ObjectLiteral) {
        return this.value[0].toAST();
    } else {
        return ast.Brackets([this.value[1].toAST()]);
    }
};

cst.ArrayLiteral.prototype.toAST = function() {
    return ast.ArrayLiteral(this.value.map(function(node) { return node.toAST(); }));
};

cst.ElementList.prototype.toAST = function() {
    return ast.ElementList(this.value.map(function(node) { return node.toAST(); }));
};

cst.Elision.prototype.toAST = function() {
    return ast.Elision(this.value.map(function(node) { return node.toAST(); }));
};

cst.ObjectLiteral.prototype.toAST = function() {
    return ast.ObjectLiteral(this.value.map(function(node) { return node.toAST(); }));
};

cst.PropertyNameAndValueList.prototype.toAST = function() {
    return ast.PropertyNameAndValueList(this.value.map(function(node) { return node.toAST(); }));
};

cst.PropertyAssignment.prototype.toAST = function() {
    return ast.PropertyAssignment(this.value.map(function(node) { return node.toAST(); }));
};

cst.PropertyName.prototype.toAST = function() {
    return ast.PropertyName(this.value.map(function(node) { return node.toAST(); }));
};

cst.PropertySetParameterList.prototype.toAST = function() {
    return ast.PropertySetParameterList(this.value.map(function(node) { return node.toAST(); }));
};

cst.MemberExpression.prototype.toAST = function() {
    if(this.value[0] instanceof cst.PrimaryExpression) {
        return this.value[0].toAST();
    } else if(this.value[0] instanceof cst.FunctionExpression) {
        return this.value[0].toAST();
    } else if(this.value[1] === '[') {
        return ast.MemberExpression([this.value[0].toAST(), this.value[2].toAST()]);
    } else if(this.value[1] === '.') {
        return ast.MemberExpression([this.value[0].toAST(), this.value[2]]);
    } else if(this.value[0] === 'new') {
        return ast.NewExpression([this.value[1].toAST(), this.value[2].toAST()]);
    }
};

cst.NewExpression.prototype.toAST = function() {
    if(this.value[0] instanceof cst.MemberExpression) {
        return this.value[0].toAST();
    } else {
        return ast.NewExpression([this.value[1].toAST()]);
    }
};

cst.CallExpression.prototype.toAST = function() {
    return ast.CallExpression(this.value.map(function(node) { return node.toAST(); }));
};

cst.Arguments.prototype.toAST = function() {
    if(this.value.length === 2) {
        return ast.Arguments([]);
    } else {
        return ast.Arguments(this.value[1].toAST());
    }
};

cst.ArgumentList.prototype.toAST = function() {
    if(this.value[0] instanceof cst.AssignmentExpression) {
        return [this.value[0].toAST()];
    } else {
        return this.value[0].toAST().concat([this.value[2].toAST()]);
    }
};

cst.LeftHandSideExpression.prototype.toAST = function() {
    return this.value[0].toAST();
};

cst.PostfixExpression.prototype.toAST = function() {
    if(this.value.length === 1) {
        return this.value[0].toAST();
    } else {
        return ast.PostfixExpression([this.value[0].toAST(), this.value[1]]);
    }
};

cst.UnaryExpression.prototype.toAST = function() {
    if(this.value[0] instanceof cst.PostfixExpression) {
        return this.value[0].toAST();
    } else {
        return ast.PrefixExpression([this.value[0], this.value[1].toAST()]);
    }
};

cst.MultiplicativeExpression.prototype.toAST = function() {
    if(this.value[0] instanceof cst.UnaryExpression) {
        return this.value[0].toAST();
    } else {
        return ast.BinaryExpression([this.value[0].toAST(), this.value[1], this.value[2].toAST()]);
    }
};

cst.AdditiveExpression.prototype.toAST = function() {
    if(this.value[0] instanceof cst.MultiplicativeExpression) {
        return this.value[0].toAST();
    } else {
        return ast.BinaryExpression([this.value[0].toAST(), this.value[1], this.value[2].toAST()]);
    }
};

cst.ShiftExpression.prototype.toAST = function() {
    if(this.value[0] instanceof cst.AdditiveExpression) {
        return this.value[0].toAST();
    } else {
        return ast.BinaryExpression([this.value[0].toAST(), this.value[1], this.value[2].toAST()]);
    }
};

cst.RelationalExpression.prototype.toAST = function() {
    if(this.value[0] instanceof cst.ShiftExpression) {
        return this.value[0].toAST();
    } else {
        return ast.BinaryExpression([this.value[0].toAST(), this.value[1], this.value[2].toAST()]);
    }
};

cst.RelationalExpressionNoIn.prototype.toAST = function() {
    return ast.RelationalExpressionNoIn(this.value.map(function(node) { return node.toAST(); }));
};

cst.EqualityExpression.prototype.toAST = function() {
    if(this.value[0] instanceof cst.RelationalExpression) {
        return this.value[0].toAST();
    } else {
        return ast.BinaryExpression([this.value[0].toAST(), this.value[1], this.value[2].toAST()]);
    }
};

cst.EqualityExpressionNoIn.prototype.toAST = function() {
    return ast.EqualityExpressionNoIn(this.value.map(function(node) { return node.toAST(); }));
};

cst.BitwiseANDExpression.prototype.toAST = function() {
    if(this.value[0] instanceof cst.EqualityExpression) {
        return this.value[0].toAST();
    } else {
        return ast.BinaryExpression([this.value[0].toAST(), this.value[1], this.value[2].toAST()]);
    }
};

cst.BitwiseANDExpressionNoIn.prototype.toAST = function() {
    return ast.BitwiseANDExpressionNoIn(this.value.map(function(node) { return node.toAST(); }));
};

cst.BitwiseXORExpression.prototype.toAST = function() {
    if(this.value[0] instanceof cst.BitwiseANDExpression) {
        return this.value[0].toAST();
    } else {
        return ast.BinaryExpression([this.value[0].toAST(), this.value[1], this.value[2].toAST()]);
    }
};

cst.BitwiseXORExpressionNoIn.prototype.toAST = function() {
    return ast.BitwiseXORExpressionNoIn(this.value.map(function(node) { return node.toAST(); }));
};

cst.BitwiseORExpression.prototype.toAST = function() {
    if(this.value[0] instanceof cst.BitwiseXORExpression) {
        return this.value[0].toAST();
    } else {
        return ast.BinaryExpression([this.value[0].toAST(), this.value[1], this.value[2].toAST()]);
    }
};

cst.BitwiseORExpressionNoIn.prototype.toAST = function() {
    return ast.BitwiseORExpressionNoIn(this.value.map(function(node) { return node.toAST(); }));
};

cst.LogicalANDExpression.prototype.toAST = function() {
    if(this.value[0] instanceof cst.BitwiseORExpression) {
        return this.value[0].toAST();
    } else {
        return ast.BinaryExpression([this.value[0].toAST(), this.value[1], this.value[2].toAST()]);
    }
};

cst.LogicalANDExpressionNoIn.prototype.toAST = function() {
    return ast.LogicalANDExpressionNoIn(this.value.map(function(node) { return node.toAST(); }));
};

cst.LogicalORExpression.prototype.toAST = function() {
    if(this.value[0] instanceof cst.LogicalANDExpression) {
        return this.value[0].toAST();
    } else {
        return ast.BinaryExpression([this.value[0].toAST(), this.value[1], this.value[2].toAST()]);
    }
};

cst.LogicalORExpressionNoIn.prototype.toAST = function() {
    return ast.LogicalORExpressionNoIn(this.value.map(function(node) { return node.toAST(); }));
};

cst.ConditionalExpression.prototype.toAST = function() {
    if(this.value.length === 1) {
        return this.value[0].toAST();
    } else {
        return ast.TernaryExpression([this.value[0].toAST(), this.value[2].toAST(), this.value[4].toAST()]);
    }
};

cst.ConditionalExpressionNoIn.prototype.toAST = function() {
    return ast.ConditionalExpressionNoIn(this.value.map(function(node) { return node.toAST(); }));
};

cst.AssignmentExpression.prototype.toAST = function() {
    if(this.value[0] instanceof cst.ConditionalExpression) {
        return this.value[0].toAST();
    } else {
        return ast.BinaryExpression([this.value[0].toAST(), this.value[1].toAST(), this.value[2].toAST()]);
    }
};

cst.AssignmentExpressionNoIn.prototype.toAST = function() {
    return ast.AssignmentExpressionNoIn(this.value.map(function(node) { return node.toAST(); }));
};

cst.AssignmentOperator.prototype.toAST = function() {
    return this.value[0];
};

cst.Expression.prototype.toAST = function() {
    if(this.value[0] instanceof cst.AssignmentExpression) {
        return this.value[0].toAST();
    } else {
        return ast.BinaryExpression([this.value[0].toAST(), this.value[1], this.value[2].toAST()]);
    }
};

cst.ExpressionNoIn.prototype.toAST = function() {
    return ast.ExpressionNoIn(this.value.map(function(node) { return node.toAST(); }));
};

cst.Statement.prototype.toAST = function() {
    return this.value[0].toAST();
};

cst.Block.prototype.toAST = function() {
    return ast.Block(this.value.map(function(node) { return node.toAST(); }));
};

cst.StatementList.prototype.toAST = function() {
    return ast.StatementList(this.value.map(function(node) { return node.toAST(); }));
};

cst.VariableStatement.prototype.toAST = function() {
    return ast.VariableStatement(this.value[1].toAST());
};

cst.VariableDeclarationList.prototype.toAST = function() {
    if(this.value[0] instanceof cst.VariableDeclaration) {
        return [this.value[0].toAST()];
    } else {
        return this.value[0].toAST().concat([this.value[2].toAST()]);
    }
};

cst.VariableDeclarationListNoIn.prototype.toAST = function() {
    return ast.VariableDeclarationListNoIn(this.value.map(function(node) { return node.toAST(); }));
};

cst.VariableDeclaration.prototype.toAST = function() {
    if(this.value.length === 1) {
        return ast.VariableDeclaration([this.value[0]]);
    } else {
        return ast.VariableDeclaration([this.value[0], this.value[1].toAST()]);
    }
};

cst.VariableDeclarationNoIn.prototype.toAST = function() {
    return ast.VariableDeclarationNoIn(this.value.map(function(node) { return node.toAST(); }));
};

cst.Initialiser.prototype.toAST = function() {
    return this.value[1].toAST();
};

cst.InitialiserNoIn.prototype.toAST = function() {
    return ast.InitialiserNoIn(this.value.map(function(node) { return node.toAST(); }));
};

cst.EmptyStatement.prototype.toAST = function() {
    return ast.EmptyStatement(this.value.map(function(node) { return node.toAST(); }));
};

cst.ExpressionStatement.prototype.toAST = function() {
    return ast.ExpressionStatement([this.value[0].toAST()]);
};

cst.IfStatement.prototype.toAST = function() {
    return ast.IfStatement(this.value.map(function(node) { return node.toAST(); }));
};

cst.IterationStatement.prototype.toAST = function() {
    return ast.IterationStatement(this.value.map(function(node) { return node.toAST(); }));
};

cst.ContinueStatement.prototype.toAST = function() {
    return ast.ContinueStatement(this.value.map(function(node) { return node.toAST(); }));
};

cst.BreakStatement.prototype.toAST = function() {
    return ast.BreakStatement(this.value.map(function(node) { return node.toAST(); }));
};

cst.ReturnStatement.prototype.toAST = function() {
    return ast.ReturnStatement(this.value.map(function(node) { return node.toAST(); }));
};

cst.WithStatement.prototype.toAST = function() {
    return ast.WithStatement(this.value.map(function(node) { return node.toAST(); }));
};

cst.SwitchStatement.prototype.toAST = function() {
    return ast.SwitchStatement(this.value.map(function(node) { return node.toAST(); }));
};

cst.CaseBlock.prototype.toAST = function() {
    return ast.CaseBlock(this.value.map(function(node) { return node.toAST(); }));
};

cst.CaseClauses.prototype.toAST = function() {
    return ast.CaseClauses(this.value.map(function(node) { return node.toAST(); }));
};

cst.CaseClause.prototype.toAST = function() {
    return ast.CaseClause(this.value.map(function(node) { return node.toAST(); }));
};

cst.DefaultClause.prototype.toAST = function() {
    return ast.DefaultClause(this.value.map(function(node) { return node.toAST(); }));
};

cst.LabelledStatement.prototype.toAST = function() {
    return ast.LabelledStatement(this.value.map(function(node) { return node.toAST(); }));
};

cst.ThrowStatement.prototype.toAST = function() {
    return ast.ThrowStatement(this.value.map(function(node) { return node.toAST(); }));
};

cst.TryStatement.prototype.toAST = function() {
    return ast.TryStatement(this.value.map(function(node) { return node.toAST(); }));
};

cst.Catch.prototype.toAST = function() {
    return ast.Catch(this.value.map(function(node) { return node.toAST(); }));
};

cst.Finally.prototype.toAST = function() {
    return ast.Finally(this.value.map(function(node) { return node.toAST(); }));
};

cst.DebuggerStatement.prototype.toAST = function() {
    return ast.DebuggerStatement(this.value.map(function(node) { return node.toAST(); }));
};

cst.FunctionDeclaration.prototype.toAST = function() {
    return ast.FunctionDeclaration(this.value.map(function(node) { return node.toAST(); }));
};

cst.FunctionExpression.prototype.toAST = function() {
    return ast.FunctionExpression(this.value.map(function(node) { return node.toAST(); }));
};

cst.FormalParameterList.prototype.toAST = function() {
    return ast.FormalParameterList(this.value.map(function(node) { return node.toAST(); }));
};

cst.FunctionBody.prototype.toAST = function() {
    return ast.FunctionBody(this.value.map(function(node) { return node.toAST(); }));
};

cst.Program.prototype.toAST = function() {
    return ast.Program(this.value[0].toAST());
};

cst.SourceElements.prototype.toAST = function() {
    if(this.value[0] instanceof cst.SourceElement) {
        return [this.value[0].toAST()];
    } else {
        return this.value[0].toAST().concat([this.value[1].toAST()]);
    }
};

cst.SourceElement.prototype.toAST = function() {
    return this.value[0].toAST();
};
