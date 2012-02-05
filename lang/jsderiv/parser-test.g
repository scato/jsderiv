/*
 * import {INT, STRING} from .common;
 * 
 * export constructor Statement, Expression;
 * 
 * export grammar Example {
 *     start NEWLINE ;
 *     
 *     NEWLINE : "\n" ;
 * }
 */

import Parser from ..src.jsderiv.parser;

import {ID, LITERAL, SYMBOL, CLASS, KEYWORD} from ..src.jsderiv.lexer;
import {Module, Import, Export, Constructor, Grammar, Start, Rule} from ..src.jsderiv.parser;
import {Or, Red, And, Seq, Any, Many, Maybe, Ignore, Not, Token, Ref, Class, Literal, InstanceOf} from ..src.jsderiv.parser;

export test "start" {
    start Parser.start;
    
    assert (
        KEYWORD "import", SYMBOL "{", ID "INT", SYMBOL ",", ID "STRING", SYMBOL "}", KEYWORD "from", SYMBOL ".", ID "common", SYMBOL ";",
        KEYWORD "export", KEYWORD "constructor", ID "Statement", SYMBOL ",", ID "Expression", SYMBOL ";",
        KEYWORD "export", KEYWORD "grammar", ID "Example", SYMBOL "{",
            KEYWORD "start", ID "NEWLINE", SYMBOL ";",
            ID "NEWLINE", SYMBOL ":", LITERAL "\"\\n\"", SYMBOL ";",
        SYMBOL "}"
    ) -> (
        Module(
            Import(("INT", "STRING"), ".common"),
            Export(Constructor("Statement", "Expression")),
            Export(Grammar("Example", (
                Start(Ref("NEWLINE")),
                Rule("NEWLINE", Literal("\"\\n\""))
            )))
        )
    );
}

export test "Import" {
    start Parser.Import;
    
    assert (
        KEYWORD "import", SYMBOL "{", ID "INT", SYMBOL ",", ID "STRING", SYMBOL "}", KEYWORD "from", SYMBOL ".", ID "common", SYMBOL ";"
    ) -> (
        Import(("INT", "STRING"), ".common")
    );
}

export test "Export" {
    start Parser.Export;
    
    assert (
        KEYWORD "export", KEYWORD "constructor", ID "Statement", SYMBOL ",", ID "Expression", SYMBOL ";"
    ) -> (
        Export(Constructor("Statement", "Expression"))
    );
}

export test "Constructor" {
    start Parser.Constructor;
    
    assert (
        KEYWORD "constructor", ID "Statement", SYMBOL ",", ID "Expression", SYMBOL ";",
    ) -> (
        Constructor("Statement", "Expression")
    );
}

export test "Grammar" {
    start Parser.Grammar;
    
    assert (
        KEYWORD "grammar", ID "Example", SYMBOL "{",
            KEYWORD "start", ID "NEWLINE", SYMBOL ";",
            ID "NEWLINE", SYMBOL ":", LITERAL "\"\\n\"", SYMBOL ";",
        SYMBOL "}"
    ) -> (
        Grammar("Example", (
            Start(Ref("NEWLINE")),
            Rule("NEWLINE", Literal("\"\\n\""))
        ))
    );
}

export test "Rule" {
    start Parser.Rule;
    
    assert (KEYWORD "start", ID "NEWLINE", SYMBOL ";") -> (Start(Ref("NEWLINE")));
    assert (KEYWORD "start") -> {};
    
    assert (ID "NEWLINE", SYMBOL ":", LITERAL "\"\\n\"", SYMBOL ";") -> (Rule("NEWLINE", Literal("\"\\n\"")));
    assert (ID "NEWLINE") -> {};
}

export test "IdentifierList" {
    start Parser.IdentifierList;
    
    assert (SYMBOL "{", ID "INT", SYMBOL ",", ID "STRING", SYMBOL "}") -> (("INT", "STRING"));
}

export test "ModuleIdentifier" {
    start Parser.ModuleIdentifier;
    
    assert (SYMBOL ".", ID "common") -> (".common");
}

/*
 * ExpressionExample :
 *       "var"! Identifier (","! Identifier)* ";"! -> Variable
 *     | "function"! Identifier? "("! Param+ ")"! -> Call
 *     | ( @INT | @STRING & ~ @INT ) -> Value ;
 */

export test "Expression" {
    start Parser.Expression;
    
    assert (
        LITERAL "\"var\"", SYMBOL "!", ID "Identifier",
            SYMBOL "(", LITERAL "\",\"", SYMBOL "!", ID "Identifier", SYMBOL ")",
            SYMBOL "*", LITERAL "\";\"", SYMBOL "!", SYMBOL "->", ID "Variable",
        SYMBOL "|", LITERAL "\"function\"", SYMBOL "!", ID "Identifier", SYMBOL "?",
            LITERAL "\"(\"", SYMBOL "!", ID "Param", SYMBOL "+", LITERAL "\")\"", SYMBOL "!",
            SYMBOL "->", ID "Call",
        SYMBOL "|", SYMBOL "(", SYMBOL "@", ID "INT", SYMBOL "|",
            SYMBOL "@", ID "STRING", SYMBOL "&", SYMBOL "~", SYMBOL "@", ID "INT", SYMBOL ")",
            SYMBOL "->", ID "Value"
    ) -> (
        Or(Or(
            Red(Seq(Seq(Seq(
                Ignore(Literal("\"var\"")),
                Ref("Identifier")),
                Any(Seq(Ignore(Literal("\",\"")), Ref("Identifier")))),
                Ignore(Literal("\";\""))
            ), "Variable"),
            Red(Seq(Seq(Seq(Seq(
                Ignore(Literal("\"function\"")),
                Maybe(Ref("Identifier"))),
                Ignore(Literal("\"(\""))),
                Many(Ref("Param"))),
                Ignore(Literal("\")\""))
            ), "Call")),
            Red(Or(
                InstanceOf("INT"),
                And(InstanceOf("STRING"), Not(InstanceOf("INT")))
            ), "Value")
        )
    );
}

export test "OrExpr" {
    start Parser.OrExpr;
    
    assert (
        SYMBOL "@", ID "INT", SYMBOL "|",
            SYMBOL "@", ID "STRING", SYMBOL "&", SYMBOL "~", SYMBOL "@", ID "INT"
    ) -> (
        Or(
            InstanceOf("INT"),
            And(InstanceOf("STRING"), Not(InstanceOf("INT")))
        )
    );
}

export test "RedExpr" {
    start Parser.RedExpr;
    
    assert (
        SYMBOL "(", SYMBOL "@", ID "INT", SYMBOL "|",
            SYMBOL "@", ID "STRING", SYMBOL "&", SYMBOL "~", SYMBOL "@", ID "INT", SYMBOL ")",
            SYMBOL "->", ID "Value"
    ) -> (
        Red(Or(
            InstanceOf("INT"),
            And(InstanceOf("STRING"), Not(InstanceOf("INT")))
        ), "Value")
    );
}

export test "AndExpr" {
    start Parser.AndExpr;
    
    assert (
        SYMBOL "@", ID "STRING", SYMBOL "&", SYMBOL "~", SYMBOL "@", ID "INT"
    ) -> (
        And(InstanceOf("STRING"), Not(InstanceOf("INT")))
    );
}

export test "SeqExpr" {
    start Parser.SeqExpr;
    
    assert (
        LITERAL "\",\"", SYMBOL "!", ID "Identifier"
    ) -> (
        Seq(Ignore(Literal("\",\"")), Ref("Identifier"))
    );
}

export test "RightExpr" {
    start Parser.RightExpr;
    
    assert (
        SYMBOL "(", LITERAL "\",\"", SYMBOL "!", ID "Identifier", SYMBOL ")", SYMBOL "*"
    ) -> (
        Any(Seq(Ignore(Literal("\",\"")), Ref("Identifier")))
    );
    
    assert (
        ID "Param", SYMBOL "+"
    ) -> (
        Many(Ref("Param"))
    );
    
    assert (
        ID "Identifier", SYMBOL "?"
    ) -> (
        Maybe(Ref("Identifier"))
    );
    
    assert (
        LITERAL "\"(\"", SYMBOL "!"
    ) -> (
        Ignore(Literal("\"(\""))
    );
}

export test "LeftExpr" {
    start Parser.LeftExpr;
    
    assert (
        SYMBOL "~", SYMBOL "@", ID "INT"
    ) -> (
        Not(InstanceOf("INT"))
    );
}

export test "Terminal" {
    start Parser.Terminal;
    
    assert (SYMBOL "(", ID "id", SYMBOL ")") -> (Ref("id"));
    assert (SYMBOL "@", ID "STRING") -> (InstanceOf("STRING"));
    assert (ID "id") -> (Ref("id"));
    assert (CLASS "[a-z]") -> (Class("[a-z]"));
    assert (LITERAL "\"literal\"") -> (Literal("\"literal\""));
    
    assert (SYMBOL "|") -> {};
    assert (KEYWORD "start") -> {};
}
