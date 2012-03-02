import Lexical, Syntactic, String from .ecmascript5;

augment grammar Lexical {
    // TODO: which one depends on the context (so far for CFG)
    start InputElementDiv | InputElementRegExp;
    
    // make IdentifierName greedy
    IdentifierName: default ?= ~IdentifierPart;
    
}

constructor Identifier;

augment grammar Syntactical {
    start Program;
    
    Identifier: Lexical::IdentifierName -> Identifier;
}

augment grammar String {
    
}
