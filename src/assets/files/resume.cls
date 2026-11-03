%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Medium Length Professional CV
% LaTeX Class
% Version 3.0 (December 17, 2022)
%
% This template has been downloaded from:
% http://www.LaTeXTemplates.com
%
% Original header:
% Copyright (C) 2010 by Trey Hunner
%
% Copying and distribution of this file, with or without modification,
% are permitted in any medium without royalty provided the copyright
% notice and this notice are preserved. This file is offered as-is,
% without any warranty.
%
% Created by Trey Hunner and modified by www.LaTeXTemplates.com
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%----------------------------------------------------------------------------------------
%	CLASS CONFIGURATION
%----------------------------------------------------------------------------------------

\ProvidesClass{resume}[2022/12/17 v3.0 Resume class]

\DeclareOption*{\PassOptionsToClass{\CurrentOption}{article}}
\ProcessOptions\relax

\LoadClass{article}

%----------------------------------------------------------------------------------------
%	REQUIRED PACKAGES AND MISC CONFIGURATIONS
%----------------------------------------------------------------------------------------

\usepackage[parfill]{parskip}
\usepackage{array}
\usepackage{ifthen}
\usepackage{graphicx}

\pagestyle{empty}

%----------------------------------------------------------------------------------------
%	MARGINS
%----------------------------------------------------------------------------------------

\usepackage{geometry}

\geometry{
	top=0.6in,
	bottom=0.6in,
	left=0.75in,
	right=0.75in,
}

%----------------------------------------------------------------------------------------
%	NAME AND ADDRESS COMMANDS
%----------------------------------------------------------------------------------------

\newcommand{\name}[1]{\renewcommand{\name}{#1}}

\newcommand{\addressSep}{$\diamond$}

\let \@addressone \relax
\let \@addresstwo \relax
\let \@addressthree \relax

\newcommand{\address}[1]{
	\@ifundefined{@addressone}{
		\def \@addressone {#1}
	}{
		\@ifundefined{@addresstwo}{
			\def \@addresstwo {#1}
		}{
			\def \@addressthree {#1}
		}%
	}
}

\newcommand{\printaddress}[1]{
	\begingroup
		\def \\ {\addressSep\ }
		\centerline{#1}
	\endgroup
	\par
	\smallskip
}

\newcommand{\printname}{
	\begingroup
		\hfil{\MakeUppercase{\huge\bfseries\name}}\hfil
		\bigskip\break
	\endgroup
}

%----------------------------------------------------------------------------------------
%	OUTPUT THE NAME & ADDRESS LINES AUTOMATICALLY
%----------------------------------------------------------------------------------------

\let\ori@document=\document
\renewcommand{\document}{
	\ori@document
	\printname
	\@ifundefined{@addressone}{}{\printaddress{\@addressone}}
	\@ifundefined{@addresstwo}{}{\printaddress{\@addresstwo}}
	\@ifundefined{@addressthree}{}{\printaddress{\@addressthree}}
}

%----------------------------------------------------------------------------------------
%	SECTION FORMATTING
%----------------------------------------------------------------------------------------

\newenvironment{rSection}[1]{
	\medskip
	\MakeUppercase{\textbf{#1}}
	\medskip
	\hrule
	\begin{list}{}{
		\setlength{\leftmargin}{1.5em}
	}
	\item[]
}{
	\end{list}
}

%----------------------------------------------------------------------------------------
%	WORK EXPERIENCE FORMATTING
%----------------------------------------------------------------------------------------

\newenvironment{rSubsection}[4]{
	\textbf{#1} \hfill {#2}
	\ifthenelse{\equal{#3}{}}{}{
		\\
		\textit{#3} \hfill \textit{#4}
	}%
	\smallskip
	\begin{list}{$\cdot$}{\leftmargin=0em}
		\setlength{\itemsep}{-0.5em} \vspace{-0.5em}
}{
	\end{list}
	\vspace{0.5em}
}