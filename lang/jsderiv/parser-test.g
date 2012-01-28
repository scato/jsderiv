import {Grammar: Lexer} from ..src.jsderiv.lexer;
import Grammar from ..src.jsderiv.parser;

import {ID, LITERAL, SYMBOL, CLASS, KEYWORD} from ..src.jsderiv.lexer;
import {Module, Grammar, Start, Rule} from ..src.jsderiv.parser;
import {Or, Red, And, Seq, Any, Many, Maybe, Ignore, Not, Token, Ref, Class, Literal} from ..src.jsderiv.parser;

export test "Terminal" {
    start Grammar.Terminal;
    
    assert (ID "id") -> (Ref("id"));
    assert (CLASS "[a-z]") -> (Class("[a-z]"));
    assert (LITERAL "\"literal\"") -> (Literal("\"literal\""));
    assert (SYMBOL "|") -> {};
    assert (KEYWORD "start") -> {};
}

export test "Rule" {
    start Grammar.Rule;
    
    assert (KEYWORD "start", ID "NEWLINE", SYMBOL ";") -> (Start(Ref("NEWLINE")));
    assert (ID "NEWLINE", SYMBOL ":", LITERAL("\"\\n\""), SYMBOL ";") -> (Rule("NEWLINE", Literal("\"\\n\"")));
    assert (KEYWORD "start") -> {};
    assert (ID "NEWLINE") -> {};
}
