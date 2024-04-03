import { mergeAttributes, Node, nodePasteRule } from "@tiptap/core";

import {
  getEmbedUrlFromYoutubeUrl,
  isValidYoutubeUrl,
  YOUTUBE_REGEX_GLOBAL,
} from "./utils.js";

import Preview from "./Preview.svelte";

export interface YoutubeOptions {
  addPasteHandler: boolean;
  allowFullscreen: boolean;
  autoplay: boolean;
  ccLanguage?: string;
  ccLoadPolicy?: boolean;
  controls: boolean;
  disableKBcontrols: boolean;
  enableIFrameApi: boolean;
  endTime: number;
  height: number;
  interfaceLanguage?: string;
  ivLoadPolicy: number;
  loop: boolean;
  modestBranding: boolean;
  HTMLAttributes: Record<string, any>;
  inline: boolean;
  nocookie: boolean;
  origin: string;
  playlist: string;
  progressBarColor?: string;
  width: number;
}

type SetYoutubeVideoOptions = {
  src?: string;
  width?: number;
  height?: number;
  start?: number;
} | undefined;

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    youtube: {
      /**
       * Insert a youtube video
       */
      setYoutubeVideo: (options: SetYoutubeVideoOptions) => ReturnType;
    };
  }
}

export const Youtube = Node.create<YoutubeOptions>({
  name: "youtube",

  addOptions() {
    return {
      addPasteHandler: true,
      allowFullscreen: true,
      autoplay: false,
      ccLanguage: undefined,
      ccLoadPolicy: undefined,
      controls: true,
      disableKBcontrols: false,
      enableIFrameApi: false,
      endTime: 0,
      height: 480,
      interfaceLanguage: undefined,
      ivLoadPolicy: 0,
      loop: false,
      modestBranding: false,
      HTMLAttributes: {},
      inline: false,
      nocookie: false,
      origin: "",
      playlist: "",
      progressBarColor: undefined,
      width: 640,
    };
  },

  inline() {
    return this.options.inline;
  },

  group() {
    return this.options.inline ? "inline" : "block";
  },

  draggable: false,
  content: "text*",
  selectable: false,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      start: {
        default: 0,
      },
      width: {
        default: this.options.width,
      },
      height: {
        default: this.options.height,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'youtube',
      },
    ];
  },

  addCommands() {
    return {
      setYoutubeVideo:
        (options: SetYoutubeVideoOptions) =>
          ({ commands }) => {
            if (options?.src && !isValidYoutubeUrl(options.src)) {
              return false;
            }

            return commands.insertContent({
              type: this.name,
              attrs: options,
            });
          },
    };
  },

  // addPasteRules() {
  //   if (!this.options.addPasteHandler) {
  //     return [];
  //   }

  //   return [
  //     nodePasteRule({
  //       find: YOUTUBE_REGEX_GLOBAL,
  //       type: this.type,
  //       getAttributes: (match) => {
  //         return { src: match.input };
  //       },
  //     }),
  //   ];
  // },

  addNodeView() {
    return ({
      editor,
      node,
      getPos,
      HTMLAttributes,
      decorations,
      extension,
    }) => {
      const { view } = editor;
      if (HTMLAttributes.src) {
        const embedUrl = getEmbedUrlFromYoutubeUrl({
          url: HTMLAttributes.src,
          allowFullscreen: this.options.allowFullscreen,
          autoplay: this.options.autoplay,
          ccLanguage: this.options.ccLanguage,
          ccLoadPolicy: this.options.ccLoadPolicy,
          controls: this.options.controls,
          disableKBcontrols: this.options.disableKBcontrols,
          enableIFrameApi: this.options.enableIFrameApi,
          endTime: this.options.endTime,
          interfaceLanguage: this.options.interfaceLanguage,
          ivLoadPolicy: this.options.ivLoadPolicy,
          loop: this.options.loop,
          modestBranding: this.options.modestBranding,
          nocookie: this.options.nocookie,
          origin: this.options.origin,
          playlist: this.options.playlist,
          progressBarColor: this.options.progressBarColor,
          startAt: HTMLAttributes.start || 0,
        });

        HTMLAttributes.src = embedUrl;
      }

      const remove = () => {
        // @ts-ignore
        const from = getPos();
        const to = from + node.nodeSize
        editor.commands.deleteRange({ from, to })
      }

      const updateSrc = (src: string) => {
        view.dispatch(view.state.tr.setNodeMarkup(getPos(), undefined, {
          src,
        }))
      }

      const dom = document.createElement("div");
      new Preview({
        target: dom,
        props: {
          remove,
          updateSrc,
          iframeAttributes: mergeAttributes(
            this.options.HTMLAttributes,
            {
              width: this.options.width,
              height: this.options.height,
              allowfullscreen: this.options.allowFullscreen,
              autoplay: this.options.autoplay,
              ccLanguage: this.options.ccLanguage,
              ccLoadPolicy: this.options.ccLoadPolicy,
              disableKBcontrols: this.options.disableKBcontrols,
              enableIFrameApi: this.options.enableIFrameApi,
              endTime: this.options.endTime,
              interfaceLanguage: this.options.interfaceLanguage,
              ivLoadPolicy: this.options.ivLoadPolicy,
              loop: this.options.loop,
              modestBranding: this.options.modestBranding,
              origin: this.options.origin,
              playlist: this.options.playlist,
              progressBarColor: this.options.progressBarColor,
            },
            HTMLAttributes
          ),
        },
      });

      return {
        dom,
      }
    };
  },

  addKeyboardShortcuts() {
    const isPreviewInput = (element: Element | null) => {
      if (!element) {
        return false;
      }

      return element.tagName === "INPUT" && element.classList.contains("preview_input");
    }

    return {
      'Backspace': () => {
        const input = document.activeElement as HTMLInputElement;
        if (!isPreviewInput(input)) {
          return false;
        }

        input.value = input.value.slice(0, input.value.length - 1)
        return true;
      },
      'Enter': () => {
        const input = document.activeElement as HTMLInputElement;
        if (!isPreviewInput(input)) {
          return false;
        }

        const form = input.parentElement as HTMLFormElement;
        form.submit();

        return true;
      }
    }
  },

  renderHTML({ HTMLAttributes, node }) {
    return ['youtube', mergeAttributes(HTMLAttributes)];
    // const embedUrl = getEmbedUrlFromYoutubeUrl({
    //   url: HTMLAttributes.src,
    //   allowFullscreen: this.options.allowFullscreen,
    //   autoplay: this.options.autoplay,
    //   ccLanguage: this.options.ccLanguage,
    //   ccLoadPolicy: this.options.ccLoadPolicy,
    //   controls: this.options.controls,
    //   disableKBcontrols: this.options.disableKBcontrols,
    //   enableIFrameApi: this.options.enableIFrameApi,
    //   endTime: this.options.endTime,
    //   interfaceLanguage: this.options.interfaceLanguage,
    //   ivLoadPolicy: this.options.ivLoadPolicy,
    //   loop: this.options.loop,
    //   modestBranding: this.options.modestBranding,
    //   nocookie: this.options.nocookie,
    //   origin: this.options.origin,
    //   playlist: this.options.playlist,
    //   progressBarColor: this.options.progressBarColor,
    //   startAt: HTMLAttributes.start || 0,
    // });

    // HTMLAttributes.src = embedUrl;

    // const el = document.createElement("input");
    // new Preview({
    //   target: el,
    //   props: {
    //     iframeAttributes: mergeAttributes(
    //       this.options.HTMLAttributes,
    //       {
    //         width: this.options.width,
    //         height: this.options.height,
    //         allowfullscreen: this.options.allowFullscreen,
    //         autoplay: this.options.autoplay,
    //         ccLanguage: this.options.ccLanguage,
    //         ccLoadPolicy: this.options.ccLoadPolicy,
    //         disableKBcontrols: this.options.disableKBcontrols,
    //         enableIFrameApi: this.options.enableIFrameApi,
    //         endTime: this.options.endTime,
    //         interfaceLanguage: this.options.interfaceLanguage,
    //         ivLoadPolicy: this.options.ivLoadPolicy,
    //         loop: this.options.loop,
    //         modestBranding: this.options.modestBranding,
    //         origin: this.options.origin,
    //         playlist: this.options.playlist,
    //         progressBarColor: this.options.progressBarColor,
    //       },
    //       HTMLAttributes
    //     ),
    //   },
    // });

    // return el;
  },
});
