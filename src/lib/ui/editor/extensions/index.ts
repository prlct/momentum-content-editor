import { InputRule } from '@tiptap/core';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import TiptapImage from '@tiptap/extension-image';
import TiptapLink from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextStyle from '@tiptap/extension-text-style';
import { Embed } from '../youtube/embed.js';
import TiptapUnderline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import UploadImagesPlugin from '../plugins/upload-images.js';
import SlashCommand from './slash-command.js';
import UpdatedImage from './updated-image.js';
import GlobalDragHandle from 'tiptap-extension-global-drag-handle'
// import AutoJoiner from 'tiptap-extension-auto-joiner'


export const defaultExtensions = [
	StarterKit.configure({
		bulletList: {
			HTMLAttributes: {
				class: 'list-disc list-outside leading-3 -mt-2'
			}
		},
		orderedList: {
			HTMLAttributes: {
				class: 'list-decimal list-outside leading-3 -mt-2'
			}
		},
		listItem: {
			HTMLAttributes: {
				class: 'leading-normal -mb-2'
			}
		},
		blockquote: {
			HTMLAttributes: {
				class: 'border-l-4 border-stone-700'
			}
		},
		codeBlock: {
			HTMLAttributes: {
				class: 'rounded-sm bg-stone-100 p-5 font-mono font-medium text-stone-800'
			}
		},
		code: {
			HTMLAttributes: {
				class: 'rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-stone-900',
				spellcheck: 'false'
			}
		},
		horizontalRule: false,
		dropcursor: {
			color: '#DBEAFE',
			width: 4
		},
		gapcursor: false
	}),
	
	GlobalDragHandle.configure({
		dragHandleWidth: 20,    // default

		// The scrollTreshold specifies how close the user must drag an element to the edge of the lower/upper screen for automatic 
		// scrolling to take place. For example, scrollTreshold = 100 means that scrolling starts automatically when the user drags an 
		// element to a position that is max. 99px away from the edge of the screen
		// You can set this to 0 to prevent auto scrolling caused by this extension
		scrollTreshold: 100     // default
	}),

	// patch to fix horizontal rule bug: https://github.com/ueberdosis/tiptap/pull/3859#issuecomment-1536799740
	HorizontalRule.extend({
		addInputRules() {
			return [
				new InputRule({
					find: /^(?:---|—-|___\s|\*\*\*\s)$/,
					handler: ({ state, range }) => {
						const attributes = {};

						const { tr } = state;
						const start = range.from;
						const end = range.to;

						tr.insert(start - 1, this.type.create(attributes)).delete(
							tr.mapping.map(start),
							tr.mapping.map(end)
						);
					}
				})
			];
		}
	}).configure({
		HTMLAttributes: {
			class: 'mt-4 mb-6 border-t border-stone-300'
		}
	}),
	TiptapLink.configure({
		HTMLAttributes: {
			class:
				'text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer'
		}
	}),
	TiptapImage.extend({
		addProseMirrorPlugins() {
			return [UploadImagesPlugin()];
		}
	}).configure({
		allowBase64: true,
		HTMLAttributes: {
			class: 'rounded-lg border border-stone-200'
		}
	}),
	UpdatedImage.configure({
		HTMLAttributes: {
			class: 'rounded-lg border border-stone-200'
		}
	}),
	Placeholder.configure({
		placeholder: ({ node }: any) => {
			if (node.type.name === 'heading') {
				return `Heading ${node.attrs.level}`;
			}
			if (node.type.name === 'social_embed' || node.type.name==='youtube') {
				return;
			}

			return "Press '/' for commands, or '++' for AI autocomplete...";
		},
		includeChildren: true
	}),
	SlashCommand,
	TiptapUnderline,
	TextStyle,
	Color,
	Highlight.configure({
		multicolor: true
	}),
	TaskList.configure({
		HTMLAttributes: {
			class: 'not-prose pl-2'
		}
	}),
	TaskItem.configure({
		HTMLAttributes: {
			class: 'flex items-start my-4'
		},
		nested: true
	}),
	// Markdown.configure({
	// 	html: true,
	// 	// transformCopiedText: true
	// }),
	Embed.configure({
		inline: false,
	}),
	// AutoJoiner,
];
