import Lexer, KEYWORD from .lexer;

augment grammar Lexer {
    KEYWORD: default | ("test" | "assert") -> KEYWORD;
}
