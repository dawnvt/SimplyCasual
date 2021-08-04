import knex, { Knex } from 'knex';
import config from './config.json';
import { User, Score, Song } from './api/schema';

const db = knex({
    connection: config.db,
    client: 'pg',
    version: '13',
    debug: true,
    migrations: {
        tableName: 'migrations'
    }
});

export default db;

declare module 'knex/types/tables' {
    interface Tables {
        users: User;
        scores: Score;
        songs: Song;

        users_composite: Knex.CompositeTableType<User, Pick<User, 'name'> & Partial<Pick<User, 'created_at' | 'updated_at'>>, Partial<Omit<User, 'id'>>>
        scores_composite: Knex.CompositeTableType<Score, Pick<Score, 'user_id'> & Partial<Pick<Score, 'created_at' | 'updated_at'>>, Partial<Omit<Score, 'id'>>>
        songs_composite: Knex.CompositeTableType<User, Pick<User, 'name'> & Partial<Pick<User, 'created_at' | 'updated_at'>>, Partial<Omit<User, 'id'>>>
    }
}

declare module 'knex' {
    namespace Knex {
        interface Table<TRecord extends {} = any, TResult extends {} = any> {
            <
                TTable extends TableNames,
                TRecord2 = TableType<TTable>,
                TResult2 = DeferredKeySelection.ReplaceBase<TResult, ResolveTableType<TRecord2>>
                >(
                tableName: TTable,
                options?: TableOptions
            ): QueryBuilder<TRecord2, TResult2>;
            <
                TRecord2 = unknown,
                TResult2 = DeferredKeySelection.ReplaceBase<TResult, TRecord2>
                >(
                tableName: TableDescriptor | AliasDict,
                options?: TableOptions
            ): QueryBuilder<TRecord2, TResult2>;
            <
                TRecord2 = unknown,
                TResult2 = DeferredKeySelection.ReplaceBase<TResult, TRecord2>
                >(
                callback: QueryCallback<TRecord, TResult>,
                options?: TableOptions
            ): QueryBuilder<TRecord2, TResult2>;
            <
                TRecord2 = unknown,
                TResult2 = DeferredKeySelection.ReplaceBase<TResult, TRecord2>
                >(
                raw: Raw,
                options?: TableOptions
            ): QueryBuilder<TRecord2, TResult2>;
        }
    }
}

declare namespace DeferredKeySelection {
    type Any = DeferredKeySelection<any, any, any, any, any, any, any>;

    type SetBase<TSelection, TBase> = TSelection extends DeferredKeySelection<
        any,
        infer TKeys,
        infer THasSelect,
        infer TAliasMapping,
        infer TSingle,
        infer TIntersectProps,
        infer TUnionProps
    >
        ? DeferredKeySelection<TBase, TKeys, THasSelect, TAliasMapping, TSingle, TIntersectProps, TUnionProps>
        : DeferredKeySelection<TBase, never>;

    type ReplaceBase<TSelection, TBase> = UnwrapArrayMember<
        TSelection
    > extends DeferredKeySelection.Any
        ? ArrayIfAlready<TSelection, DeferredKeySelection.SetBase<UnwrapArrayMember<TSelection>, TBase>>
        : unknown extends UnwrapArrayMember<TSelection>
        ? ArrayIfAlready<TSelection, DeferredKeySelection.SetBase<unknown, TBase>>
        : TSelection;
}

type UnwrapArrayMember<T> = T extends (infer M)[] ? M : T;

type DeferredKeySelection<
    TBase,
    TKeys extends string,
    THasSelect extends true | false = false,
    TAliasMapping extends {} = {},
    TSingle extends boolean = false,
    TIntersectProps extends {} = {},
    TUnionProps = never
    > = {
        _base: TBase;
        _hasSelection: THasSelect;
        _keys: TKeys;
        _aliases: TAliasMapping;
        _single: TSingle;
        _intersectProps: TIntersectProps;
        _unionProps: TUnionProps;
    };

type ArrayIfAlready<T1, T2> = AnyToUnknown<T1> extends any[] ? T2[] : T2;

type AnyToUnknown<T> = unknown extends T ? unknown : T;

type TableOptions = PgTableOptions;

interface PgTableOptions {
    only?: boolean;
}