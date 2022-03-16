import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  debug = true;
  debugErr = true;

  constructor() {

  }

  isEmpty(obj) {
    for(const key in obj) {
        if(obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
  }

  deepCopyObject (inObject) {
    let outObject, value, key;

    if (typeof inObject !== 'object' || inObject === null) {
      return inObject; // Return the value if inObject is not an object
    }

    // Create an array or object to hold the values
    outObject = Array.isArray(inObject) ? [] : {};

    for (key in inObject) {
      value = inObject[key];

      // Recursively (deep) copy for nested objects, including arrays
      outObject[key] = this.deepCopyObject(value);
    }

    return outObject;
  }

  getFilenameFromFilePath(filePath) {
    let filename = '';
    const pathArr = filePath.split('/');
    if (pathArr.length > 0) {
      filename = pathArr[pathArr.length - 1];
      if(this.debug){
        console.log('UtilsService: getFilename(): pathArr: ', pathArr);
      }
      if(this.debug){
        console.log('UtilsService: getFilename(): filename 1: ',filename);
      }
      const filenameArr = filename.split('?');
      if (filenameArr.length > 0) {
        const queryStr = filenameArr[filenameArr.length - 1];
        filename = filenameArr[0];
        if(this.debug){
          console.log('UtilsService: getFilename(): filename 2: ',filename,' queryStr: ',queryStr);
        }
      }
      return filename.trim();
    }
    return '';
  }

  uuid(): string {
    let i, random;
    let result = '';
    for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) {
            result += '-';
        }
        result += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
            .toString(16);
    }
    return result;
  };

  rgbToHex(r,g,b): string {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);
    if (r.length == 1)
      r = '0' + r;
    if (g.length == 1)
      g = '0' + g;
    if (b.length == 1)
      b = '0' + b;
    return '#' + r + g + b;
  }

  rgbaToHex(rgba = [], background = 255): string {
    let red = 255;
    let green = 255;
    let blue = 255;
    if(Array.isArray(rgba) && rgba.length == 4){
      let r = rgba[0];
      let g = rgba[1];
      let b = rgba[2];
      let a = rgba[3];
      red = Math.round(r * a + background * (1 - a));
      green = Math.round(g * a + background * (1 - a));
      blue = Math.round(b * a + background * (1 - a));
    }
    return this.rgbToHex(red, green, blue);
  }

  hexToRgb(hex): any {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  getBlackOrWhite(hexcolor): string {
    hexcolor = hexcolor.replace('#', '');
    const r = parseInt(hexcolor.substr(0,2), 16);
    const g = parseInt(hexcolor.substr(2,2), 16);
    const b = parseInt(hexcolor.substr(4,2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
  }

  shadeHexColor(color, percent) {
    const f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return '#'+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
  }

  blendHexColors(c0, c1, p) {
    const f=parseInt(c0.slice(1),16),t=parseInt(c1.slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF,R2=t>>16,G2=t>>8&0x00FF,B2=t&0x0000FF;
    return '#'+(0x1000000+(Math.round((R2-R1)*p)+R1)*0x10000+(Math.round((G2-G1)*p)+G1)*0x100+(Math.round((B2-B1)*p)+B1)).toString(16).slice(1);
  }

  shadeRGBColor(color, percent) {
    const f=color.split(','),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=parseInt(f[0].slice(4)),G=parseInt(f[1]),B=parseInt(f[2]);
    return 'rgb('+(Math.round((t-R)*p)+R)+','+(Math.round((t-G)*p)+G)+','+(Math.round((t-B)*p)+B)+')';
  }

  blendRGBColors(c0, c1, p) {
    const f=c0.split(','),t=c1.split(','),R=parseInt(f[0].slice(4)),G=parseInt(f[1]),B=parseInt(f[2]);
    return 'rgb('+(Math.round((parseInt(t[0].slice(4))-R)*p)+R)+','+(Math.round((parseInt(t[1])-G)*p)+G)+','+(Math.round((parseInt(t[2])-B)*p)+B)+')';
  }

  shade(color, percent){
    if (color.length > 7 ) return this.shadeRGBColor(color,percent);
    else return this.shadeHexColor(color,percent);
  }

  blend(color1, color2, percent){
    if (color1.length > 7) return this.blendRGBColors(color1,color2,percent);
    else return this.blendHexColors(color1,color2,percent);
  }

  getLighterOrDarkerColor(hexcolor): string {
    hexcolor = hexcolor.replace('#', '');
    const r = parseInt(hexcolor.substr(0,2), 16);
    const g = parseInt(hexcolor.substr(2,2), 16);
    const b = parseInt(hexcolor.substr(4,2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? this.shade('#' + hexcolor, -0.5) : this.shade('#' + hexcolor, 0.5);
  }

  lightenDarkenColor(col, amt) {
    const num = parseInt(col, 16);
    const r = (num >> 16) + amt;
    const b = ((num >> 8) & 0x00FF) + amt;
    const g = (num & 0x0000FF) + amt;
    const newColor = g | (b << 8) | (r << 16);
    return newColor.toString(16);
  }

  getContrastYIQ(hexcolor): string {
    const hex = this.hexToRgb(hexcolor);
    const rgb = 'rgb(' + hex.r + ',' + hex.g + ',' + hex.b + ')';
    const colors = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    const brightness = 1;
    const r = +colors[1];
    const g = +colors[2];
    const b = +colors[3];
    const ir = Math.floor((255 - r) * brightness);
    const ig = Math.floor((255 - g) * brightness);
    const ib = Math.floor((255 - b) * brightness);
    return 'rgb('+ir+','+ig+','+ib+')';
  }

  sortArrayObj(arr: any, key = 'screen_name', method = 'asc', type = 'string'): any {
    const result = arr.sort(function(a, b) {
      if(type === 'string'){
        const valueA = a[key].toLowerCase();
        const valueB = b[key].toLowerCase();
        if(method === 'asc'){
          if (valueA < valueB){
            return -1 ;
          }
          if (valueA > valueB){
            return 1;
          }
          return 0;
        }
        else{
          if (valueA > valueB){
            return -1 ;
          }
          if (valueA < valueB){
            return 1;
          }
          return 0;
        }
      }
      else if(type === 'date'){
        const valueA: any = new Date(a[key]);
        const valueB: any = new Date(b[key]);
        const res = method === 'asc' ? valueB - valueA : valueA - valueB;
        return res;
      }
      else{
        const valueA = +a[key];
        const valueB = +b[key];
        const res = method === 'desc' ? valueB - valueA : valueA - valueB;
        return res;
      }
    });
    return result;
  }

  isDate(date): boolean {
    const res = Object.prototype.toString.call(date) === '[object Date]';
    return res;
  }

  isNumber(number): boolean {
    const res = !isNaN(number);
    return res;
  }

}
