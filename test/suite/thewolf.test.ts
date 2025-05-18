import * as assert from 'assert';
import { TheWolf } from '../../src/TheWolf';

describe('TheWolf', () => {
    // TheWolf.soqlWithUser
    it('adds WITH USER_MODE to a soql query not containing a WHERE clause', () => {
        const input = 'List<Account> a = [SELECT Id FROM Account];';
        const expected = 'List<Account> a = [SELECT Id FROM Account WITH USER_MODE];';

        const result = new TheWolf(input).soqlWithUser().value();

        assert.strictEqual(result, expected);
    });
    
    it('adds WITH USER_MODE to a soql query containing only a WHERE clause', () => {
        const input = 'List<Account> a = [SELECT Id FROM Account WHERE Name != null];';
        const expected = 'List<Account> a = [SELECT Id FROM Account WHERE Name != null WITH USER_MODE];';

        const result = new TheWolf(input).soqlWithUser().value();

        assert.strictEqual(result, expected);
    });

    it('adds WITH USER_MODE to a soql query containing a WHERE clause and a post-WITH clause', () => {
        const input = 'List<Account> a = [SELECT Id FROM Account WHERE Name != null LIMIT 10];';
        const expected = 'List<Account> a = [SELECT Id FROM Account WHERE Name != null WITH USER_MODE LIMIT 10];';

        const result = new TheWolf(input).soqlWithUser().value();

        assert.strictEqual(result, expected);
    });

    // TheWolf.dmlAsUser
    it('adds "as user" a DML statement not containing the keyword', () => {
        const input = 'insert accounts;';
        const expected = 'insert as user accounts;';

        const result = new TheWolf(input).dmlAsUser().value();

        assert.strictEqual(result, expected);
    });

    it('leaves a DML statement as is when it contains "as user"', () => {
        const input = 'insert as user accounts;';
        const result = new TheWolf(input).dmlAsUser().value();

        assert.strictEqual(result, input);
    });

    // TheWolf.withSharing
    it('adds with sharing to a class which does not contain a sharing modifier', () => {
        const input = 'public class MyClass {}';
        const expected = 'public with sharing class MyClass {}';

        const result = new TheWolf(input).withSharing().value();

        assert.strictEqual(result, expected);
    });

    it('returns a class as is if it has a with sharing modifier', () => {
        const input = 'public with sharing class MyClass {}';

        const result = new TheWolf(input).withSharing().value();

        assert.strictEqual(result, input);
    });

    it('returns a class as is if it has a without sharing modifier', () => {
        const input = 'public without sharing class MyClass {}';

        const result = new TheWolf(input).withSharing().value();

        assert.strictEqual(result, input);
    });

    // TheWolf.globalToPublic
    it('replaces global with public', () => {
        const input = 'global class MyClass {}';
        const expected = 'public class MyClass {}';

        const result = new TheWolf(input).globalToPublic().value();

        assert.strictEqual(result, expected);
    });

    it('replaces global with public including variable assignment and methods', () => {
        const input = `global class MyClass {
            global Integer count = 1;
            global Integer getCount() {}
        }`;
        const expected = `public class MyClass {
            public Integer count = 1;
            public Integer getCount() {}
        }`;

        const result = new TheWolf(input).globalToPublic().value();

        assert.strictEqual(result, expected);
    });

    it('replaces global with public in a class implementing an interface', () => {
        const input = 'global class AccountFactory implements DataFactory {}';
        const expected = 'public class AccountFactory implements DataFactory {}';

        const result = new TheWolf(input).globalToPublic().value();

        assert.strictEqual(result, expected);
    });

    it('returns input unmodified if no global keyword', () => {
        const input = 'public class MyClass {}';
        const result = new TheWolf(input).globalToPublic().value();

        assert.strictEqual(result, input);
    });

    it('returns input unmodified if the class has a @RestResource annotation', () => {
        const input = `@RestResource(urlMapping='/myapi/*')
                        global class MyRestClass {}`;
        const result = new TheWolf(input).globalToPublic().value();

        assert.strictEqual(result, input);
    });
});
