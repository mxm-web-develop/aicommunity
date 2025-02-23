export interface AppState {
    file_form: string;
    file_url: string;
    file_name?: string;
    id: string;
    status: AppStatus;
    checha_data?: any;
    annotation_method?: 'draw' | 'match';
    annotation_manager?: AnnotationItem[];
}
export interface ParsedFileItem {
    file_form: string;
    file_url: string;
    file_name?: string;
    id: string;
    checha_data?: any;
    status: AppStatus;
    page_manager?: {
        total: number;
        current: number;
    };
}
export interface AppStatev1029 {
    file_url: string[] | string;
    parse_form: 'docx' | 'cvs' | 'html' | 'txt' | 'img' | 'pdf' | string;
    display_file_type?: 'docx' | 'cvs' | 'html' | 'txt' | 'img' | 'pdf' | 'xslx' | string;
    current_file?: string;
    status: AppStatus;
    data: ParsedFileItem[];
    page_manager: {
        total: number;
        current: number;
    };
}
type AnnotationItem = DarwAnnotation | MatchAnnotation;
export declare enum AppStatus {
    UNLOAD = 0,
    LOADING = 1,
    PRASING = 2,
    FETCHED = 3,
    LOADED = 4,
    ERROR = 5
}
export interface Annotation {
    og_size?: {
        pwidth: string;
        pheight: string;
    };
    anno_color?: string;
    pageNumber: number;
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface DarwAnnotation {
    og_size?: {
        pwidth: string;
        pheight: string;
    };
    anno_color?: string;
    pageNumber: number;
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface MatchAnnotation {
    anno_color?: string;
    startValue: string;
    endValue: string;
}
export {};
