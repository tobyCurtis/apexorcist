# Apexorcist

Banishes evil code like a security exorcist. Fixes basic security vulnerabilities that would be found from static code analysis.

## Overview

There are a number of findings in Checkmarx which we can fix with regex-based find and replaces. This Node.js script modifies Apex class files to enforce Salesforce security and access best practices by applying the following transformations:

- **Adds `WITH USER_MODE`** to SOQL queries – Ensures SOQL queries execute in user context rather than system context where applicable.
- **Appends `as user`** to DML operations – Ensures data manipulation respects user permissions.
- **Adds `with sharing`** to class definitions – Enforces role-based record sharing unless already specified.
- **Replaces `global` with `public`** – Restricts access to Apex classes and members, unless the class is a `@RestResource`.

These changes help align Apex code with secure development practices and help us avoid Checkmarx findings.

## What It Does

### 1. Inserts `WITH USER_MODE` in SOQL

- Finds all SOQL queries (`[SELECT ...]`)
- Adds `WITH USER_MODE` after `WHERE` clauses and before any following clauses like `LIMIT`, `ORDER BY`, etc.
- Leaves queries unchanged if:
  - They don’t use `SELECT`
  - They already contain `WITH USER_MODE`

### 2. Appends `as user` to DML

- Transforms DML statements (`insert`, `update`, `delete`, etc.) to use `as user`
- Skips statements that already include `as user`

### 3. Adds `with sharing` to Classes

- Adds `with sharing` before the `class` keyword
- Skips if the class already has `with sharing` or `without sharing`

### 4. Replaces `global` with `public`

- Replaces `global` access modifiers with `public`
- Skips this replacement if the file contains a `@RestResource` decorator

## What It Does **Not** Do

- It does **not** parse the Apex syntax using an AST (Abstract Syntax Tree); it relies on regex-based replacements, which may fail in edge cases like:
  - Multi-line strings
  - Comments containing keywords
  - Complex nested queries or dynamic Apex
- It does **not** process multiple files—only a single file specified by the `filePath`
- It does **not** validate whether the modified Apex compiles or functions as expected in Salesforce
- It does **not** fix Checkmarx issues on non-Apex classes or triggers
- It does **not** fix methods which return a value to Visualforce pages without using a `Describe` call to check for field accessibility

## How to Use

### 1. Download the Script

`fixApexCheckmarxFindings.js`

### 2. Add It to the Folder with Your Source

Put it in whatever folder you are trying to fix source on, such as:

```
force-app/main/default/classes
force-app/main/default/triggers
```

[Download Script](https://confluenceent.cms.gov/download/attachments/1015896128/fixApexCheckmarxFindings.js?version=1&modificationDate=1747265929067&api=v2)

### 3. Set the Path to Your Apex File

At the top of the script, update:

```js
const filePath = 'cmsMyRequests.cls';
```

Replace `'cmsMyRequests.cls'` with the path to your file.

### 4. Run the Script

In your terminal, navigate to the folder containing the script and run:

```bash
node fixApexCheckmarxFindings.js
```

### 5. Output

On successful execution, you'll see something like:

```
cmsMyRequests.cls updated:
  • WITH USER_MODE added to SOQL
  • DML updated with 'as user'
  • 'with sharing' added to class
  • 'global' replaced with 'public'
```

## Example

### Before:

```apex
global class MyController {
    global void updateRecords(List<Account> accs) {
        update accs;
    }

    void queryStuff() {
        List<Account> a = [SELECT Id FROM Account WHERE Name != null LIMIT 10];
    }
}
```

### After:

```apex
public with sharing class MyController {
    public void updateRecords(List<Account> accs) {
        update as user accs;
    }

    void queryStuff() {
        List<Account> a = [SELECT Id FROM Account WHERE Name != null WITH USER_MODE LIMIT 10];
    }
}
```
