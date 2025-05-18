"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TheWolf = void 0;
class TheWolf {
    constructor(code) {
        console.log("I'm Winston Wolf. I solve problems.");
        this.code = code;
    }
    soqlWithUser() {
        const clauseKeywords = [
            "GROUP BY",
            "ORDER BY",
            "LIMIT",
            "OFFSET",
            "FOR VIEW",
            "UPDATE",
            "FOR UPDATE",
        ];
        const clauseRegex = clauseKeywords.map((k) => k.replace(" ", "\\s+")).join("|");
        const queryRegex = /\[([\s\S]*?)\]/g;
        this.code = this.code.replace(queryRegex, (match, query) => {
            if (!/SELECT\b/i.test(query) || /WITH\s+USER_MODE/i.test(query)) {
                return `[${query}]`;
            }
            // Add WITH USER_MODE after WHERE but before next clause
            const whereToClauseRegex = new RegExp(`(\\bWHERE\\b[\\s\\S]*?)(?=\\b(${clauseRegex})\\b)`, "i");
            if (whereToClauseRegex.test(query)) {
                return `[${query.replace(whereToClauseRegex, (_, whereClause) => whereClause.trimEnd() + " WITH USER_MODE ")}]`;
            }
            // Add WITH USER_MODE at end of WHERE clause if it's the last clause
            const whereToEndRegex = /(\bWHERE\b[\s\S]*?)$/i;
            if (whereToEndRegex.test(query)) {
                return `[${query.replace(whereToEndRegex, (_, whereClause) => whereClause.trimEnd() + " WITH USER_MODE")}]`;
            }
            // Fallback: Add WITH USER_MODE at the end or before any clause keyword
            const insertBeforeClauseRegex = new RegExp(`\\b(${clauseRegex})\\b`, "i");
            if (insertBeforeClauseRegex.test(query)) {
                return `[${query.replace(insertBeforeClauseRegex, "WITH USER_MODE $1")}]`;
            }
            // No WHERE, no clauses — just add it at the end
            return `[${query.trimEnd()} WITH USER_MODE]`;
        });
        return this;
    }
    // Add 'as user' to DML statements
    dmlAsUser() {
        console.log("You see, this is a situation that requires finesse.");
        const dmlKeywords = [
            "insert",
            "update",
            "delete",
            "upsert",
            "merge",
            "undelete",
        ];
        const dmlRegex = new RegExp(`\\b(${dmlKeywords.join("|")})\\s+(?!as\\s+user)(\\w+\\b)`, "gi");
        this.code = this.code.replace(dmlRegex, (match, keyword, target) => {
            return `${keyword} as user ${target}`;
        });
        return this;
    }
    // Add 'with sharing' before the class keyword, preserving other modifiers and inheritance
    withSharing() {
        console.log("Just because you are a character doesn't mean that you have character.");
        this.code = this.code.replace(/^(.*?\b)(class\s+\w+\b.*?)(?=\s*{)/m, (match, beforeClass, classAndRest) => {
            if (/with\s+sharing|without\s+sharing/i.test(beforeClass)) {
                return match; // already has sharing
            }
            return `${beforeClass}with sharing ${classAndRest}`;
        });
        return this;
    }
    // Replace all 'global' declarations with 'public' unless the file has a @RestResource annotation
    globalToPublic() {
        console.log("Gentlemen, you can't get sentimental with a mess like this.");
        if (!/@RestResource\b/.test(this.code)) {
            this.code = this.code
                .replace(/(^|\s)global(?=\s+(([\w<>]+\.)*[\w<>]+)\s+\w+\s*\()/gm, (match, p1) => `${p1}public`)
                .replace(/(^|\s)global(?=\s+(class|interface|enum|virtual|override|static|final|abstract|[\w<>]+\s+\w+))/gm, (match, p1) => `${p1}public`);
        }
        return this;
    }
    value() {
        console.log("Let's not start sucking each other's dicks quite yet.");
        return this.code;
    }
}
exports.TheWolf = TheWolf;
//# sourceMappingURL=TheWolf.js.map