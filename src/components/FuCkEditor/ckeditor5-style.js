const imageStyle = `
.ck-content .image.image_resized { max-width: 100%;display: block; box-sizing: border-box;}
.ck-content .image.image_resized img { width: 100%;}
.ck-content .image.image_resized > figcaption { display: block;}
.ck-content .image { display: table; clear: both; text-align: center; margin: 1em auto;}
.ck-content .image > img { display: block; margin: 0 auto; max-width: 100%; min-width: 50px; }
.ck-content .image-style-side,.ck-content .image-style-align-left,.ck-content .image-style-align-center,.ck-content .image-style-align-right {max-width: 50%;}
.ck-content .image-style-side {float: right;margin-left: var(--ck-image-style-spacing);}
.ck-content .image-style-align-left {float: left;margin-right: var(--ck-image-style-spacing);}
.ck-content .image-style-align-center {margin-left: auto;margin-right: auto;}
.ck-content .image-style-align-right {float: right;margin-left: var(--ck-image-style-spacing);}
.ck-content .image > figcaption {display: table-caption;caption-side: bottom;word-break: break-word;color: hsl(0, 0%, 20%);background-color: hsl(0, 0%, 97%);padding: .6em;font-size: .75em;outline-offset: -1px;}
`

const codeStyle = `.ck-content code {background-color: hsla(0, 0%, 78%, 0.3);padding: .15em;border-radius: 2px;}`

const pageBreakStyle = `
.ck-content .page-break {position: relative;clear: both;padding: 5px 0;display: flex;align-items: center;justify-content: center;}
.ck-content .page-break::after {content: '';position: absolute;border-bottom: 2px dashed hsl(0, 0%, 77%);width: 100%;}
.ck-content .page-break__label {position: relative;z-index: 1;padding: .3em .6em;display: block;text-transform: uppercase;border: 1px solid hsl(0, 0%, 77%);border-radius: 2px;font-family: Helvetica, Arial, Tahoma, Verdana, Sans-Serif;font-size: 0.75em;font-weight: bold;color: hsl(0, 0%, 20%);background: #fff;box-shadow: 2px 2px 1px hsla(0, 0%, 0%, 0.15);-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;}
@media print {.ck-content .page-break {padding: 0;}.ck-content .page-break::after {display: none;}}
`

const blockquoteStyle = `
.ck-content blockquote {overflow: hidden;padding-right: 1.5em;padding-left: 1.5em;margin-left: 0;margin-right: 0;font-style: italic;border-left: solid 5px hsl(0, 0%, 80%);}
.ck-content[dir="rtl"] blockquote {border-left: 0;border-right: solid 5px hsl(0, 0%, 80%);}
`
const mediaStyle = `
.ck-content .media {clear: both;margin: 1em 0;display: block;min-width: 15em;}
`
const tableStyle = `
.ck-content .table {margin: 1em auto;display: table;}
.ck-content .table table {border-collapse: collapse;border-spacing: 0;width: 100%;height: 100%;border: 1px double hsl(0, 0%, 70%);}
.ck-content .table table td,.ck-content .table table th {min-width: 2em;padding: .4em;border: 1px solid hsl(0, 0%, 75%);}
.ck-content .table table th {font-weight: bold;background: hsla(0, 0%, 0%, 5%);}
`
const hrStyle = `
.ck-content hr {border-width: 1px 0 0;border-style: solid;border-color: hsl(0, 0%, 37%);margin: 0;}
`
const preStyle = `
.ck-content pre {padding: 1em;color: #353535;background: hsla(0, 0%, 78%, 0.3);border: 1px solid hsl(0, 0%, 77%);border-radius: 2px;text-align: left;direction: ltr;tab-size: 4;white-space: pre-wrap;font-style: normal;min-width: 200px;}
.ck-content pre code {background: unset;padding: 0;border-radius: 0;}
`


export default {imageStyle, codeStyle, pageBreakStyle, blockquoteStyle, mediaStyle, tableStyle, hrStyle, preStyle}
