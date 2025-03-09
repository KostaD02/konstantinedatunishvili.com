---
layout: "article.njk"
title: How to Dockerize Nx monorepo with Angular and Nest
description: Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora sint officiis nobis enim neque alias dolores, architecto perferendis eos! Architecto dolorem, eaque at repudiandae est cumque iste vel soluta expedita. Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora sint officiis nobis enim neque alias dolores, architecto perferendis eos! Architecto dolorem, eaque at repudiandae est cumque iste vel soluta expedita.
image: "/assets/images/dockerize-nx-angular-nest.png"
imageAlt: Nx, Docker, Angular, and Nest logos
date: 2025-03-08
chips: ["Nx", "Angular", "NestJs", "Docker"]
tags:
  - post
  - tech
---

Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora sint officiis nobis enim neque alias dolores, architecto perferendis eos! Architecto dolorem, eaque at repudiandae est cumque iste vel soluta expedita. Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora sint officiis nobis enim neque alias dolores, architecto perferendis eos! Architecto dolorem, eaque at repudiandae est cumque iste vel soluta expedita.

## some random header

Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora sint officiis nobis enim neque alias dolores, architecto perferendis eos! Architecto dolorem, eaque at repudiandae est cumque iste vel soluta expedita. Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora sint officiis nobis enim neque alias dolores, architecto perferendis eos! Architecto dolorem, eaque at repudiandae est cumque iste vel soluta expedita.

## Code examples

some random `inline example`

```ts
function foo(): void {
  console.log("test");
}

class Test {
  constructor() {}

  foo() {}
}
```

```html
<h1>test</h1>
```

```js
function foo() {
  console.log("test");
}

class Test {
  constructor() {}
  foo() {}
}
```

```
some random code
```

```js
/^w{2, 3}$/;
```

```ts
@Component({
  selector: "sw-root",
  standalone: true,
  imports: [
    RouterModule,
    NzLayoutModule,
    NzButtonComponent,
    NzIconModule,
    NzDropDownModule,
    NzAlertModule,
    SearchComponent,
    TitleCasePipe,
    AsyncPipe,
    CommonModule,
  ],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.less"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements AfterViewInit {
  @ViewChild("alert") alertRef!: ElementRef<HTMLDivElement>;
  private readonly platform = inject(PLATFORM_ID);
  private readonly defaultDataLog = inject(LOG_GREETER);
  private readonly environment = inject(ENVIRONMENT);
  private readonly router = inject(Router);
  private readonly themeService = inject(ThemeService);
  private readonly layoutService = inject(LayoutService);
  private readonly viewport = inject(ViewportScroller);
  private readonly document = inject(DOCUMENT);
  readonly headerNavigation = inject(NAVIGATION);
  readonly themeOptions = DISPLAY_THEMES;
  readonly isBrowser = isPlatformBrowser(this.platform);

  readonly isMenuOpenedByUser$ = new BehaviorSubject<boolean>(false);
  readonly burgerTopDistance$ = new BehaviorSubject<string>("66px");

  readonly isWideScreen$ = this.layoutService.isNarrowerThan(
    this.layoutService.sizes.header,
    100
  );

  readonly isMenuOpen$ = combineLatest([
    this.isWideScreen$,
    this.isMenuOpenedByUser$,
  ]).pipe(map(([isWideScreen, isOpenByUser]) => !isWideScreen && isOpenByUser));
}
```
