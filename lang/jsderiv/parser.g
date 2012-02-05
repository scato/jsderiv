import {ID, CLASS, LITERAL} from .lexer;

export constructor Module, Import, Export, Constructor, Grammar, Start, Rule;

export constructor Or, Red, And, Seq, Any, Many, Maybe, Ignore, Not, InstanceOf, Ref, Class, Literal;

export grammar Parser {
    start Statement* -> Module ;
    
    Statement       : Import | Export | Definition ;
    Import          : "import"! IdentifierList "from"! ModuleIdentifier ";"! -> Import ;
    Export          : "export"! Definition -> Export ;
    Definition      : Constructor | Grammar ;
    Constructor     : "constructor"! @ID (","! @ID)* ";"! -> Constructor ;
    Grammar         : "grammar"! @ID "{"! (Rule* -> List) "}"! -> Grammar ;
    Rule            : "start"! Expression ";"! -> Start
                    | @ID ":"! Expression ";"! -> Rule ;
    IdentifierList  : "{"! @ID (","! @ID)* "}"! -> List ;
    ModuleIdentifier: "."* @ID ("." @ID)* -> Text ;
    
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
                | Terminal ;
    
    Terminal    : "("! Expression ")"!
                | "@"! @ID -> InstanceOf
                | @ID -> Ref
                | @CLASS -> Class
                | @LITERAL -> Literal ;
}
