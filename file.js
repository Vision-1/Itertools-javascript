function counter({startval,stepval=1,callback=(val)=>{return val}} = {}){
	const countIterator = (start,step=1,callback=(val)=>{return val}) => ({
		start,
		[Symbol.iterator](){
			return{
				current:this.start,
				next(){
					let value = callback(this.current + step)
					this.current += step
					return value
				}
			}
		}
	})
	if(callback.length !== 1){
		throw(Error,'You have to have one parameter in your callback function the value')
	}
	let count = countIterator(startval,stepval,callback)
	return count[Symbol.iterator]()
	
}
const range = (...params)=>(Array.from({
	start: (params.length > 1 && params[0]) || 0,
	stop: (params.length > 1 && params[1]) || params[0],
	step: (params.length ==3 && params[2]) || 1,
	[Symbol.iterator](){
		let conditional = this.step > 0 ? (a,b) => a <= b : (a,b) => a >= b
		return{
			current:this.start,
			end:this.stop,
			step:this.step,
			next(){
				if(conditional(this.current,this.end)){
					let done = {done:false,value:this.current}
					this.current += this.step
					return done
				} else{
					return {done:true}
				}
			}
		}
	}
}))

function zip(...arrays){
	let newArray = []
	for(let p of range(arrays[0].length-1)){
		let tempArray = []
		for(let array of arrays){
			tempArray.push(array[p])
		}
		newArray.push(tempArray)
	}
	return newArray
}

function cycle(iterable){
	const cycleInfinite = (iterable) => ({
		saved:[...iterable],
		[Symbol.iterator](){
			return{
				values:this.saved,
				currentidx:0,
				lengths:this.saved.length,
				next(){
					let value =  this.values[this.currentidx%this.lengths]
					this.currentidx += 1
					return value
				}
			}
		}
	})
	let cycler = cycleInfinite(iterable)
	return cycler[Symbol.iterator]()
}

function compress(data,selectors){
	let returnVal = []
	for ([d,s] of zip(data,selectors)){
		if(s==1){
			returnVal.push(d)
		}
	}
	return returnVal
}

function enumerate(arr){
	let otherarr = range(1,arr.length)
	return zip(arr,otherarr)
}

const chain = (...iterables)=>{
	const chainIter = (...iterables) => ({
		[Symbol.iterator](){
			return{
				idx:-1,
				get vals(){
					let newarr = []
					for(let arr of iterables){
						newarr = newarr.concat(Array.from(arr))
					}
					return newarr
				},
				next(){
					this.idx+=1
					return this.vals[this.idx]
				}
			}
		}
	})
	let p = chainIter(...iterables)
	return p[Symbol.iterator]()
}

let count = counter({startval: 1,callback : function(val){
	return val + val
}})
let cyclevar = cycle('abcd')
let iter = chain('ABCDEF',[1,0,1,0,1,1])
for(let [a,b] of enumerate([1,0,1,0,1,1])){
	document.write(a,b,'<br>')
}
