import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        class?: string | undefined;
        size?: number | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type MagicProps = typeof __propDef.props;
export type MagicEvents = typeof __propDef.events;
export type MagicSlots = typeof __propDef.slots;
export default class Magic extends SvelteComponentTyped<MagicProps, MagicEvents, MagicSlots> {
}
export {};
