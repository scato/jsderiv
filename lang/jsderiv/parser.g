import {ID, CLASS, LITERAL} from .lexer;

export constructor Module, Import, Export, Grammar, Start, Rule;

export constructor Or, Red, And, Seq, Any, Many, Maybe, Ignore, Not, InstanceOf, Ref, Class, Literal;

export grammar parser {
    start Statement* -> Module ;
    
    Statement       : Import | Export | Definition ;
    Import          : "import"! IdentifierList "from"! ModuleIdentifier ";"! -> Import ;
    Export          : "export"! Definition -> Export ;
    Definition      : Grammar ;
    Grammar         : "grammar"! @ID ";"! Definition* -> Grammar ;
    Rule            : "start"! Expression ";"! -> Start
                    | @ID ":"! Expression ";"! -> Rule ;
    IdentifierList  : "{"! @ID (","! @ID)* "}"! ;
    ModuleIdentifier: "."* @ID ("." @ID)* ;
    
    Expression  : OrExpr ;
    
    OrExpr      : OrExpr "|" RedExpr -> Or
                | RedExpr ;
    RedExpr     : AndExpr "->" @ID -> Red
                | AndExpr ;
    AndExpr     : AndExpr "&" SeqExpr -> And
                | SeqExpr ;
    SeqExpr     : SeqExpr RightExpr -> Seq
                | RightExpr ;
    RightExpr   : LeftExpr "*" -> Any
                | LeftExpr "+" -> Many
                | LeftExpr "?" -> Maybe
                | LeftExpr "!" -> Ignore
                | LeftExpr ;
    LeftExpr    : "~" Terminal -> Not
                | "@" @ID -> Token
                | Terminal ;
    
    Terminal    : "(" Expression ")"
                | @ID -> Ref
                | @CLASS -> Class
                | @LITERAL -> Literal ;
}
