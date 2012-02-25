import {ID, CLASS, LITERAL} from .lexer;

export constructor Module, Import, Export, Constructor, Grammar, Start, Rule, Augmentation;

export constructor Or, Red, And, Seq, Any, Many, Maybe, Ignore, Not, Look, InstanceOf, One, Ref, Class, Literal, Default;

export grammar Parser {
    start Statement* -> Module ;
    
    Statement       : Import | Export | Definition | Augmentation ;
    
    Import          : "import"! IdentifierList "from"! ModuleIdentifier ";"! -> Import ;
    IdentifierList  : "{"! @ID (":"! @ID)? (","! @ID (":"! @ID)?)* "}"! -> List
                    | @ID (","! @ID)* -> List ;
    ModuleIdentifier: "."* @ID ("." @ID)* -> Text ;
    
    Export          : "export"! Definition -> Export ;
    
    Definition      : Constructor | Grammar ;
    
    Constructor     : "constructor"! @ID (","! @ID)* ";"! -> Constructor ;
    
    Grammar         : "grammar"! @ID "{"! (Rule* -> List) "}"! -> Grammar ;
    Rule            : "start"! Expression ";"! -> Start
                    | @ID ":"! Expression ";"! -> Rule ;
    
    Augmentation    : "augment"! "grammar"! @ID "{"! (Rule* -> List) "}"! -> Augmentation ;
    
    Expression  : OrExpr ;
    
    OrExpr      : OrExpr "|"! RedExpr -> Or
                | RedExpr ;
    RedExpr     : RedExpr "->"! @ID -> Red
                | AndExpr ;
    AndExpr     : AndExpr "&"! SeqExpr -> And
                | SeqExpr ;
    SeqExpr     : SeqExpr RightExpr -> Seq
                | RightExpr ;
    RightExpr   : RightExpr "*"! -> Any
                | RightExpr "+"! -> Many
                | RightExpr "?"! -> Maybe
                | RightExpr "!"! -> Ignore
                | LeftExpr ;
    LeftExpr    : "~"! LeftExpr -> Not
                | "?="! LeftExpr -> Look
                | Terminal ;
    
    Terminal    : "("! Expression ")"!
                | "@"! @ID -> InstanceOf
                | "."! -> One
                | @ID -> Ref
                | @CLASS -> Class
                | @LITERAL -> Literal
                | "default"! -> Default ;
}
