/*jshint -W030*/

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
chai.use(require('sinon-chai'));

var splitterPath = '../lib/splitter';

describe('splitter module', function () {

    it('exists', function () {
        expect(require(splitterPath)).to.exist;
    });

    it('is a function', function () {
        expect(require(splitterPath)).to.be.a.function;
    });

    it('returns an object', function () {
        expect(require(splitterPath)({}, {})).to.exist;
        expect(require(splitterPath)({}, {})).to.be.an.object;
    });

    it('requires no parameters', function () {
        expect(require(splitterPath).bind(this, {})).not.to.throw();
    });

    describe('splitter instance', function () {

        var instance, css, ast;

        beforeEach(function () {
            css = 'body{font-size:16px;}';
            ast = {
                type: 'stylesheet',
                stylesheet: {
                    rules: [{}, {}, {}, {}, {}, {}]
                }
            };
        });

        describe('split function', function () {
            var result;

            beforeEach(function () {
                result = [css];
                instance = require(splitterPath)({}, {});
                instance._parseCSS = sinon.stub().returns(ast);
                instance._splitCSS = sinon.stub().returns(result);
            });

            it('exists', function () {
                expect(instance.split).to.exist;
            });

            it('takes two parameters', function () {
                expect(instance.split).to.have.length(2);
            });

            it('calls the _parseCSS function with the css parameter', function () {
                instance.split(css, 1);
                expect(instance._parseCSS).to.have.been.calledWith(css);
            });

            it('calls the _splitCSS function with the result of _parseCSS', function () {
                instance.split(css, 1);
                expect(instance._splitCSS).to.have.been.calledWith(ast, 1);
            });

            it('returns the result of _splitCSS', function () {
                expect(instance.split(css, 1)).to.equal(result);
            });
        });


        describe('_splitCSS function', function () {
            var pages;

            beforeEach(function () {
                pages = [{}, {}, {}, {}, {}, {}];

                instance = require(splitterPath)({}, {});

                instance._stringifyer = sinon.stub().returns('');
                instance._calcPageCount = sinon.stub().returns(6);
                instance._toPages = sinon.stub().returns(pages);

                instance._splitCSS(ast, 1);
            });

            it('exists', function () {
                expect(instance._splitCSS).to.exist;
            });

            it('is a function', function () {
                expect(instance._splitCSS).to.be.a('function');
            });

            it('takes two arguments', function () {
                expect(instance._splitCSS).to.have.length(2);
            });

            it('calls _stringifyer with each page', function () {

                pages.forEach(function (page) {
                    expect(instance._stringifyer).to.have.been.calledWith(page);
                });
            });

            it('returns the result of mapping _toPages to _stringifyer', function () {
                expect(instance._splitCSS(ast, 1)).to.eql(['', '', '', '', '', '']);
            });

        });

        describe('_toPages', function () {
            beforeEach(function () {
                instance = require(splitterPath)({}, {});
            });

            it('exists', function () {
                expect(instance._toPages).to.exist;
            });

            it('is a function', function () {
                expect(instance._toPages).to.be.a('function');
            });

            it('takes two arguments', function () {
                expect(instance._toPages).to.have.length(2);
            });

            it('returns an array', function () {
                expect(instance._toPages(ast, 2)).to.be.an('array');
            });
        });
    });
});
