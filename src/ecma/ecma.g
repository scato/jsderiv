export constructor Grammar, LexicalRule, SyntacticRule, StringRule;

export constructor Alt, Seq, Opt, NonInsertSeq, LookNot, Id, Lit, Ref, Empty, ButNot, ExclOr, Set, OneOf, Strict;

export grammar ECMA {
    start NEWLINE* (Rule NEWLINE*)* -> Grammar;
    
    NEWLINE: ("\n" | "\r\n")!;
    COMMENT: ("/*" ~(.* "*/" .*) "*/")!;
    SPACE  : " "!;
    
    Rule: (COMMENT NEWLINE*)? (LexicalRule | SyntacticRule | StringRule);
    
    LexicalRule  : REFERENCE SPACE  "::"! Expression -> LexicalRule;
    SyntacticRule: REFERENCE SPACE   ":"! Expression -> SyntacticRule;
    StringRule   : REFERENCE SPACE ":::"! Expression -> StringRule;
    
    REFERENCE: "<"! [^>]* ">"! -> Text;
    IDENTIFIER: [A-Za-z]+ -> Text;
    LITERAL: "\"" ([^"\\] | "\\\\" | "\\\"" | "\\t" | "\\r" | "\\n")* "\"" -> Text;
    INLINE: [{\^a-z]+ -> Text;
    
    Expression: AltExpr+ -> Alt | OneOfExpr | ButNotAnyOfExpr;
    
    AltExpr: NEWLINE SPACE+ (SeqExpr | ButNotExpr);
    
    SeqExpr: SeqExpr SPACE RightExpr -> Seq
           | SeqExpr SPACE "[no "! ExclExpr " here]"! SPACE RightExpr -> NonInsertSeq
           | RightExpr;
    RightExpr: RightExpr SPACE "[opt]"! -> Opt
             | Terminal;
    Terminal: REFERENCE -> Ref
            | LITERAL -> Lit
            | "[lookahead not in "! ExclExpr "]"! -> LookNot
            | "[empty]"! -> Empty
            | "{"! INLINE (", "! INLINE)* "}"! -> Set;
    
    ButNotExpr: REFERENCE SPACE ("but not" | "but not one of")! SPACE ExclExpr -> ButNot;
    
    ExclExpr: ExclExpr SPACE "or"! SPACE (COMMENT SPACE)? Terminal -> ExclOr
            | (COMMENT SPACE)? Terminal
            | IDENTIFIER -> Id;
    
    OneOfExpr: SPACE "one of"! OneOfList;
    OneOfList: (NEWLINE SPACE+ LitList)+ (NEWLINE SPACE+ StrictExpr)? -> OneOf;
    LitList: ((LITERAL -> Lit) SPACE)* (LITERAL -> Lit);
    StrictExpr: "<or in strict mode code>"! OneOfExpr -> Strict;
    
    ButNotAnyOfExpr: SPACE REFERENCE SPACE "but not any of:"! (OneOfList) -> ButNot;
}
