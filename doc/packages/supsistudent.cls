% Classe supsistudent
% versione 0.02, 27 settembre 2012
% Autore: Amos Brocco <amos.brocco@supsi.ch>
\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{supsistudent}[2012/09/27 v0.02 SUPSI Student,
    amos.brocco@supsi.ch]

% Modifiche impaginazione
% Autori: Mikol Faro e Sandra Gabaglio <sandra.gabaglio@supsi.ch>


% Package di base
\LoadClass[11pt]{book}
\usepackage[english]{babel}
%\usepackage[paper=a4paper,top=4.0cm,bottom=2cm,left=3cm,right=2cm]{geometry}
\usepackage[paper=a4paper,top=4.0cm,bottom=3cm]{geometry}
\usepackage[utf8]{inputenc}
%\usepackage{slantsc}
\usepackage{array}
\usepackage{amsmath}
\usepackage{titlesec}
\usepackage{hyperref}
\usepackage[style=ieee,urldate=long]{biblatex}

% Font (Helvetica, simile a Arial)
\usepackage[T1]{fontenc}
\usepackage[scaled]{helvet}

% Table
\usepackage{tabularray}

% Spaziatura
\usepackage{setspace}
\usepackage{float}

% Referenze
\usepackage{varioref}

% Style
\usepackage{fancybox}  % for custom frames
\usepackage{xcolor}  % for color definitions
\definecolor{Gallery}{rgb}{0.929,0.929,0.929}
\definecolor{Silver}{rgb}{0.741,0.741,0.741}

% Figure
\usepackage{graphicx}
% %figure custom command
\definecolor{border-color}{HTML}{EDEDED}
\newcommand{\borderfigure}[3]{
    \begin{figure}[H]
        \centering
        \setlength{\fboxsep}{0pt}  % remove default padding
        \setlength{\fboxrule}{1pt}  % set the thickness of the border
        \fcolorbox{border-color}{white}{\includegraphics[width=#3\linewidth]{#1}}
        \caption{#2}
        \label{fig:#1}
    \end{figure}
}

\newcommand{\customfigure}[3]{
    \begin{figure}[H]
        \centering
        \includegraphics[width=#3\linewidth]{#1}
        \caption{#2}
        \label{fig:#1}
    \end{figure}
}
% Per adattare margini
\usepackage[strict]{changepage}

% Per test
\usepackage{lipsum}

% Footer logo
\usepackage{eso-pic}

% White page
\usepackage{emptypage}

% Numero pagine
\usepackage{lastpage}

% Quote 
\usepackage{csquotes}

% Attach files
% \usepackage{tocloft}
\usepackage[titles]{tocloft}
\usepackage{embedfile}
\usepackage{hypgotoe}

\newcommand*{\embedfileandcreatelink}[2]{%
    \embedfile{#1}%
    \href{gotoe:embedded=#1}{#2}%
}

\newcommand{\addattachment}[2]{%
    \embedfileandcreatelink{attachments/#1}{\textit{#2}}%
    \addcontentsline{att}{attachments}{#1}%
}

\newcommand{\listofattachmentsname}{List of Attachments}
\newlistof{attachments}{att}{\listofattachmentsname}



\assignpagestyle{\chapter}{fancy}

% Comandi
\makeatletter
\newcommand{\doctitle}[1]{\def \@doctitle {#1}}
\newcommand{\student}[1]{\def \@student {#1}}
\newcommand{\supervisor}[1]{\def \@supervisor {#1}}
\newcommand{\cosupervisor}[1]{\def \@cosupervisor {#1}}
\newcommand{\committente}[1]{\def \@committente {#1}}
\newcommand{\course}[1]{\def \@course {#1}}
\newcommand{\modulo}[1]{\def \@modulo {#1}}
\newcommand{\anno}[1]{\def \@anno {#1}}
\student{}
\supervisor{}
\cosupervisor{}
\committente{}
\course{}
\modulo{}
\anno{}
\makeatother

\newcommand{\linea}[0]{\vspace*{2em}\noindent\makebox[\linewidth][l]{\rule{\textwidth}{1pt}}\hspace*{\fill}\\}

% Formattazione predefinita
\renewcommand{\rmdefault}{ptm} % Times
\renewcommand{\sfdefault}{phv} % Helvetica
\renewcommand{\ttdefault}{cmtt}
\renewcommand{\familydefault}{\sfdefault} % Font standard per il documento
\newcommand{\etichettetitolo}{\fontsize{8pt}{8pt}\fontseries{m}\selectfont}
\newcommand{\nomititolo}{\vspace{1em}\fontsize{14pt}{14pt}\fontseries{bx}\selectfont}
\setlength\parindent{0pt}
\setlength{\headsep}{40pt}
\setlength{\headheight}{17pt}
\usepackage{parskip}

\raggedbottom % Per evitare spazi bianchi inutili

\makeatletter
\newcommand{\campo}[1]{\ifx {#1} \@empty
        --
    \else
        \nomititolo{{#1}}
    \fi}
\makeatother

%\renewcommand{\chaptermark}[1]{\markboth{\thechapter.\space#1}{}} 


% Intestazione e pié di pagina
\makeatletter
\usepackage{fancyhdr}
\pagestyle{fancy}
\renewcommand{\headrulewidth}{1pt}
\renewcommand{\footrulewidth}{1pt}
\fancyhf{}
\fancyhead[LO]{
    \includegraphics[width=70mm]{packages/logoheader}
}
\fancyhead[RE]{
    \leftmark
}
\setlength{\footskip}{50pt}
\fancyfoot[LE]{
    \small{\@doctitle} \AddToShipoutPicture*{\put(58,28){\includegraphics[height=44mm]{packages/logoverticale}}}
    %\small{\@title} \AddToShipoutPicture*{\put(58,154){\scalebox{-1}{\includegraphics[height=44mm]{logoverticale}}}}
}
\fancyfoot[RO]{
    %\small{\@title} \AddToShipoutPicture*{\put(527,154){\scalebox{-1}[-1]{\includegraphics[height=44mm]{logoverticale}}}}
    \small{\@doctitle} \AddToShipoutPicture*{\put(527,28){{\includegraphics[height=44mm]{packages/logoverticale}}}}
}
\fancyhead[LE, RO]{
    % \small{\thepage/\pageref{LastPage}}
    \small{\thepage}
}
%\fancyhead[RO]{
% \small{\thepage/\pageref{LastPage}}
%}
\makeatother

\renewcommand{\chaptermark}[1]{ \markboth{#1}{} }
% Pagina titolo
\makeatletter
\def \maketitle {%
    \begin{titlepage}
        % Allinea a sinistra
        \raggedright
        % Intestazione SUPSI e logo
        \vspace{20mm}
        {\parindent-1mm\makebox(0,0)[lb]{\includegraphics[width=170mm]{packages/logoprima}}}
        \\
        {\Huge \textrm{\@doctitle}} \\
        \vspace{10mm}
        \linea
        \begin{minipage}[t]{0.49\textwidth}
            \begin{flushleft}
                \etichettetitolo{Student} \\
                \campo{\@student}
            \end{flushleft}
        \end{minipage}
        \hspace*{\fill}
        \begin{minipage}[t]{0.49\textwidth}
            \begin{flushleft}
                \etichettetitolo{Supervisors} \\
                \campo{\@supervisor} \\
                % \linea
                % \vspace*{0.3em} % Fix spaziatura
                % \etichettetitolo{Co-supervisor} \\
                % \campo{\@cosupervisor} \\
                %				\linea  
                %				\vspace*{0.3em} % Fix spaziatura
                %				\etichettetitolo{Committente} \\
                %				\campo{\@committente} \\	
            \end{flushleft}
        \end{minipage} \\
        \vspace{5mm}
        \linea
        %\begin{minipage}[t]{0.49\textwidth}
        %	\begin{flushleft}
        %\etichettetitolo{Modulo} \\
        %\campo{\@modulo} \\
        %		\end{flushleft}
        %	\end{minipage}
        \hspace*{\fill}
        \begin{minipage}[t]{0.99\textwidth}
            \begin{flushleft}
                \etichettetitolo{Degree Course} \\
                \campo{\@course} \\
            \end{flushleft}
        \end{minipage} \\
        \vspace*{1em}
        \linea
        \vspace*{0.3em}
        \etichettetitolo{Year} \\
        \campo{\@anno} \\
        \vfill

        \begin{minipage}[b]{0.49\textwidth}
            \begin{flushleft}
                \linea
                \vspace*{0.3em} % Fix spaziatura
                \etichettetitolo{Date} \\
                \campo{\@date} \\
            \end{flushleft}
        \end{minipage}
        \hspace*{\fill}

        % \begin{minipage}[b]{0.49\textwidth}
        % \begin{flushright}
        \leavevmode\makebox(0,0){\put(434,180){\includegraphics[height=71mm]{packages/logoverticale}}}
        % \end{flushright}

        % \end{minipage}

        %Aggiunge una pagina bianca senza header e footer dietro la copertina
        \newpage
        \thispagestyle{empty}
        \mbox{}
        \newpage
    \end{titlepage}
    \setlength{\voffset}{-15mm}
    \singlespacing
}
\makeatother