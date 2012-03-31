import Lexer from .lexer;
import ID, LITERAL, SYMBOL, CLASS, KEYWORD from .lexer;

export test "SPACE" {
    start Lexer.SPACE;
    
    assert " " -> ();
}

export test "ID" {
    start Lexer.ID;
    
    assert "id" -> (ID "id");
    assert "start" -> {};
    assert "id2" -> (ID "id2");
    assert "ID_2" -> (ID "ID_2");
}

export test "COMMENT" {
    start Lexer.COMMENT;
    
    assert "/* comment */" -> ();
    assert "// comment" -> ();
}

export test "LITERAL" {
    start Lexer.LITERAL;
    
    assert "\"literal\"" -> (LITERAL "\"literal\"");
}

export test "SYMBOL" {
    start Lexer.SYMBOL;
    
    assert "|" -> (SYMBOL "|");
    assert "<" -> (SYMBOL "<");
    assert ">" -> (SYMBOL ">");
}

export test "CLASS" {
    start Lexer.CLASS;
    
    assert "[0-9]" -> (CLASS "[0-9]");
    assert "[123]" -> (CLASS "[123]");
    assert "[^0-9]" -> (CLASS "[^0-9]");
    assert "[^123]" -> (CLASS "[^123]");
    assert "[0-9^123]" -> (CLASS "[0-9^123]");
    assert "[0-]" -> {};
    assert "[^]" -> {};
}

export test "KEYWORD" {
    start Lexer.KEYWORD;
    
    assert "start" -> (KEYWORD "start");
    assert "extends" -> (KEYWORD "extends");
    assert "super" -> (KEYWORD "super");
}

export test "start" {
    start Lexer.start;
    
    assert "id /* comment */ \"literal\" | [0-9] start" -> (ID "id", LITERAL "\"literal\"", SYMBOL "|", CLASS "[0-9]", KEYWORD "start");
    assert "id /* comment */ \"literal\" | [0-9] start 123" -> {};
}

/*
 * import {INT, STRING} from .common-lib;
 * 
 * export constructor Statement, Expression;
 * 
 * export grammar Example {
 *     start NEWLINE ;
 *     
 *     NEWLINE : "\n" ;
 * }
 */

import Parser from .parser;

import {ID, LITERAL, SYMBOL, CLASS, KEYWORD} from .lexer;
import {Module, Import, Export, Constructor, Grammar, Start, Rule} from .parser;
import {Or, Red, And, Seq, Any, Many, Maybe, Ignore, Not, Look, Token, One, Ref, Class, Literal, InstanceOf, Default, Super, Capture} from .parser;

export test "start" {
    start Parser.start;
    
    assert (
        KEYWORD "import", SYMBOL "{", ID "INT", SYMBOL ",", ID "STRING", SYMBOL "}", KEYWORD "from", SYMBOL ".", ID "common-lib", SYMBOL ";",
        KEYWORD "export", KEYWORD "constructor", ID "Statement", SYMBOL ",", ID "Expression", SYMBOL ";",
        KEYWORD "export", KEYWORD "grammar", ID "Example", SYMBOL "{",
            KEYWORD "start", ID "NEWLINE", SYMBOL ";",
            ID "NEWLINE", SYMBOL ":", LITERAL "\"\\n\"", SYMBOL ";",
        SYMBOL "}"
    ) -> (
        Module(
            Import(("INT", "STRING"), ".common-lib"),
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
        KEYWORD "import", SYMBOL "{", ID "INT", SYMBOL ",", ID "STRING", SYMBOL "}", KEYWORD "from", SYMBOL ".", ID "common-lib", SYMBOL ";"
    ) -> (
        Import(("INT", "STRING"), ".common-lib")
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
        KEYWORD "constructor", ID "Statement", SYMBOL ",", ID "Expression", SYMBOL ";"
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
    
    assert (
        KEYWORD "grammar", ID "Example2", KEYWORD "extends", ID "Example", SYMBOL "{",
            ID "NEWLINE", SYMBOL ":", KEYWORD "super", SYMBOL "|", LITERAL "\"\\r\\n\"", SYMBOL ";",
        SYMBOL "}"
    ) -> (
        Grammar("Example2", "Example", (
            Rule("NEWLINE", Or(Super(), Literal("\"\\r\\n\"")))
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
    assert (SYMBOL ".", LITERAL "'common-lib'") -> (".'common-lib'");
}

/*
 * ExpressionExample :
 *       "var"! < Identifier (","! Identifier)* > ";"! -> Variable
 *     | "function"! Identifier? "("! Param+ ")"! -> Call
 *     | ( @INT | @STRING & ~ @INT ) -> Value ;
 */

export test "Expression" {
    start Parser.Expression;
    
    assert (
        LITERAL "\"var\"", SYMBOL "!", SYMBOL "<", ID "Identifier",
            SYMBOL "(", LITERAL "\",\"", SYMBOL "!", ID "Identifier", SYMBOL ")",
            SYMBOL "*", SYMBOL ">", LITERAL "\";\"", SYMBOL "!", SYMBOL "->", ID "Variable",
        SYMBOL "|", LITERAL "\"function\"", SYMBOL "!", ID "Identifier", SYMBOL "?",
            LITERAL "\"(\"", SYMBOL "!", ID "Param", SYMBOL "+", LITERAL "\")\"", SYMBOL "!",
            SYMBOL "->", ID "Call",
        SYMBOL "|", SYMBOL "(", SYMBOL "@", ID "INT", SYMBOL "|",
            SYMBOL "@", ID "STRING", SYMBOL "&", SYMBOL "~", SYMBOL "@", ID "INT", SYMBOL ")",
            SYMBOL "->", ID "Value"
    ) -> (
        Or(Or(
            Red(Seq(Seq(
                Ignore(Literal("\"var\"")),
                Capture(Seq(
                    Ref("Identifier"),
                    Any(Seq(Ignore(Literal("\",\"")), Ref("Identifier")))
                ))),
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
    
    assert (
        SYMBOL "?=", SYMBOL "@", ID "INT"
    ) -> (
        Look(InstanceOf("INT"))
    );
}

export test "Terminal" {
    start Parser.Terminal;
    
    assert (SYMBOL "(", ID "id", SYMBOL ")") -> (Ref("id"));
    assert (SYMBOL "<", ID "id", SYMBOL ">") -> (Capture(Ref("id")));
    assert (SYMBOL "@", ID "STRING") -> (InstanceOf("STRING"));
    assert (SYMBOL ".") -> (One());
    assert (ID "id") -> (Ref("id"));
    assert (CLASS "[a-z]") -> (Class("[a-z]"));
    assert (LITERAL "\"literal\"") -> (Literal("\"literal\""));
    assert (KEYWORD "default") -> (Default());
    assert (KEYWORD "super") -> (Super());
    
    assert (SYMBOL "|") -> {};
    assert (KEYWORD "start") -> {};
}
