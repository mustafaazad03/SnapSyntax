"use client";
import { useEffect, useMemo, useRef, useState } from "react";

interface CodeProps {
	placeholder: string;
	initialValue?: string;
}
import { EditorView } from "@codemirror/view";
import createTheme from "@uiw/codemirror-themes";
import { hslToHsla as adjustLightness, generateColors } from "@/lib/colors";
import { tags as t } from "@lezer/highlight";
import { useCodeMirror } from "@uiw/react-codemirror";
import { useStore } from "@/lib/store";
import { debounce } from "@/lib/debounce";
import { useHotkeys } from "react-hotkeys-hook";
import { cn } from "@/lib/cn";

export default function Edits({ editable = false }: { editable: boolean }) {
	const [selectedLanguage, setSelectedLanguage] = useState<any>(null);
	const [localEditable, setLocalEditable] = useState(editable);

	const editorRef = useRef<HTMLDivElement>(null);

	const code = useStore((state) => state.code);
	const update = useStore((state) => state.update);
	const lineNumbers = useStore((state) => state.lineNumbers);
	const language = useStore((state) => state.language);
	const theme = useStore((state) => state.theme);

	const lineWrapping = EditorView.lineWrapping;
	const setTabIndex = EditorView.contentAttributes.of({ tabIndex: "-1" });

	const baseColors = useMemo(() => {
		return theme.baseColors;
	}, [theme.baseColors]);

	const generatedColors = useMemo(() => {
		return generateColors(baseColors);
	}, [baseColors]);

	useEffect(() => {
		async function loadLanguage() {
			const lang = (await language.extension()) as any;

			setSelectedLanguage(lang);
		}

		loadLanguage();
	}, [language]);

	const debouncedUpdate = debounce(update, 300);

	const { setContainer, view } = useCodeMirror({
		container: editorRef.current,
		value: code ?? "",
		onChange: (value) => debouncedUpdate("code", value),
		placeholder: "//Add some temporary notes here...",
		autoFocus: true,
		editable: localEditable,
		readOnly: !localEditable,
		basicSetup: {
			lineNumbers: lineNumbers,
			foldGutter: false,
			autocompletion: false,
			indentOnInput: false,
			highlightActiveLine: false,
			highlightActiveLineGutter: false,
			dropCursor: false,
			searchKeymap: false,
			lintKeymap: false,
			completionKeymap: false,
			foldKeymap: false,
		},
		theme: createTheme({
			theme: "dark",
			settings: {
				background: "transparent",
				foreground: "white",
				caret: localEditable ? generatedColors.at(0) : "transparent",
				selection: adjustLightness(generatedColors.at(0)!, 0.2),
				selectionMatch: adjustLightness(generatedColors.at(1)!, 0.2),
				lineHighlight: "transparent",
				gutterBackground: "transparent",
				gutterForeground: adjustLightness(generatedColors.at(0)!, 0.4),
				gutterBorder: "transparent",
			},
			styles: [],
		}),

		extensions: [lineWrapping, setTabIndex],
	});

	useEffect(() => {
		if (!editable) {
			setLocalEditable(false);
		}
	}, [editable]);

	useEffect(() => {
		if (editorRef.current) {
			setContainer(editorRef.current);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editorRef.current]);

	useEffect(() => {
		function handleClick(event: MouseEvent) {
			if (
				editable &&
				editorRef.current?.contains(event.target as Node) &&
				!localEditable
			) {
				setLocalEditable(true);
			}
		}

		document.addEventListener("click", handleClick);

		return () => {
			document.removeEventListener("click", handleClick);
		};
	}, [editable, localEditable]);

	useEffect(() => {
		if (editorRef.current) {
			const textboxElement = document.querySelector('[role="textbox"]');

			if (textboxElement) {
				textboxElement.setAttribute("aria-label", "code-editor");
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editorRef.current]);

	useHotkeys(
		"f",
		() => {
			if (!view?.hasFocus) {
				view?.focus();

				setLocalEditable(true);

				view?.dispatch({
					selection: {
						anchor: 0,
						head: view.state.doc.length,
					},
				});
			}
		},
		{
			enabled: editable,
			preventDefault: true,
		},
		[view]
	);

	useHotkeys(
		"escape",
		() => {
			if (view?.hasFocus) {
				view.contentDOM.blur();

				setLocalEditable(false);
			}
		},
		{
			enabled: editable && localEditable,
			enableOnContentEditable: true,
		},
		[view, localEditable]
	);

	return (
		<div
			ref={editorRef}
			className={cn("rounded-lg p-3 w-[75vw] bg-transparent")}
		/>
	);
}
