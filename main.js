// 矩阵计算器主要逻辑
class MatrixCalculator {
    constructor() {
        this.matrixA = [];
        this.matrixB = [];
        this.history = [];
        this.init();
    }

    init() {
        this.createParticles();
        this.updateMatrixSize('A');
        this.updateMatrixSize('B');
        this.loadHistory();
    }

    // 创建浮动粒子背景
    createParticles() {
        const particlesContainer = document.getElementById('particles');
        const symbols = ['∑', '∫', '∂', '∇', '≈', '≠', '≤', '≥', '∞', 'π', 'θ', 'λ', 'μ', 'σ', 'τ', 'φ'];
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // 更新矩阵尺寸
    updateMatrixSize(matrixName) {
        const rows = parseInt(document.getElementById(`rows${matrixName}`).value);
        const cols = parseInt(document.getElementById(`cols${matrixName}`).value);
        const container = document.getElementById(`matrix${matrixName}`);
        
        container.innerHTML = '';
        container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const input = document.createElement('input');
                input.type = 'number';
                input.className = 'matrix-cell';
                input.value = i === j ? 1 : 0;
                input.step = 'any';
                input.oninput = () => this.validateInput(input);
                container.appendChild(input);
            }
        }
        
        this.updateMatrixData(matrixName);
    }

    // 验证输入
    validateInput(input) {
        if (input.value === '' || isNaN(input.value)) {
            input.style.borderColor = '#f87171';
        } else {
            input.style.borderColor = 'rgba(0, 212, 255, 0.3)';
        }
    }

    // 更新矩阵数据
    updateMatrixData(matrixName) {
        const container = document.getElementById(`matrix${matrixName}`);
        const inputs = container.querySelectorAll('.matrix-cell');
        const rows = parseInt(document.getElementById(`rows${matrixName}`).value);
        const cols = parseInt(document.getElementById(`cols${matrixName}`).value);
        
        this[`matrix${matrixName}`] = [];
        let index = 0;
        
        for (let i = 0; i < rows; i++) {
            this[`matrix${matrixName}`][i] = [];
            for (let j = 0; j < cols; j++) {
                this[`matrix${matrixName}`][i][j] = parseFloat(inputs[index].value) || 0;
                index++;
            }
        }
    }

    // 填充矩阵
    fillMatrix(matrixName, type) {
        const container = document.getElementById(`matrix${matrixName}`);
        const inputs = container.querySelectorAll('.matrix-cell');
        const rows = parseInt(document.getElementById(`rows${matrixName}`).value);
        const cols = parseInt(document.getElementById(`cols${matrixName}`).value);
        
        inputs.forEach((input, index) => {
            const i = Math.floor(index / cols);
            const j = index % cols;
            
            switch (type) {
                case 'identity':
                    input.value = i === j ? 1 : 0;
                    break;
                case 'random':
                    input.value = Math.floor(Math.random() * 10) - 5;
                    break;
            }
        });
        
        this.updateMatrixData(matrixName);
        this.animateMatrixFill(container);
    }

    // 清空矩阵
    clearMatrix(matrixName) {
        const container = document.getElementById(`matrix${matrixName}`);
        const inputs = container.querySelectorAll('.matrix-cell');
        
        inputs.forEach(input => {
            input.value = 0;
        });
        
        this.updateMatrixData(matrixName);
    }

    // 矩阵填充动画
    animateMatrixFill(container) {
        const inputs = container.querySelectorAll('.matrix-cell');
        anime({
            targets: inputs,
            scale: [0.8, 1],
            opacity: [0.5, 1],
            duration: 300,
            delay: anime.stagger(50),
            easing: 'easeOutElastic(1, .8)'
        });
    }

    // 执行矩阵运算
    performOperation(operation) {
        this.updateMatrixData('A');
        this.updateMatrixData('B');
        
        const statusElement = document.getElementById('calcStatus');
        statusElement.textContent = '计算中...';
        statusElement.className = 'mt-6 text-center text-sm text-yellow-400';
        
        try {
            let result;
            let operationName = '';
            
            switch (operation) {
                case 'add':
                    result = this.addMatrices(this.matrixA, this.matrixB);
                    operationName = '矩阵加法';
                    break;
                case 'subtract':
                    result = this.subtractMatrices(this.matrixA, this.matrixB);
                    operationName = '矩阵减法';
                    break;
                case 'multiply':
                    result = this.multiplyMatrices(this.matrixA, this.matrixB);
                    operationName = '矩阵乘法';
                    break;
                case 'elementwise':
                    result = this.elementWiseMultiply(this.matrixA, this.matrixB);
                    operationName = '逐元素乘法';
                    break;
                case 'transpose':
                    result = this.transposeMatrix(this.matrixA);
                    operationName = '矩阵转置';
                    break;
                case 'inverse':
                    result = this.inverseMatrix(this.matrixA);
                    operationName = '矩阵求逆';
                    break;
                case 'determinant':
                    result = this.determinant(this.matrixA);
                    operationName = '行列式计算';
                    break;
                case 'rank':
                    result = this.matrixRank(this.matrixA);
                    operationName = '矩阵秩计算';
                    break;
                case 'scalarMultiply':
                    const scalar = parseFloat(document.getElementById('scalar').value);
                    result = this.scalarMultiply(scalar, this.matrixA);
                    operationName = `标量乘法 (${scalar} × A)`;
                    break;
                case 'power':
                    const power = parseInt(document.getElementById('power').value);
                    result = this.matrixPower(this.matrixA, power);
                    operationName = `矩阵幂 (A^${power})`;
                    break;
            }
            
            this.displayResult(result, operationName);
            this.addToHistory(operationName, result);
            
            statusElement.textContent = '计算完成！';
            statusElement.className = 'mt-6 text-center text-sm text-green-400';
            
        } catch (error) {
            statusElement.textContent = `计算错误: ${error.message}`;
            statusElement.className = 'mt-6 text-center text-sm text-red-400';
        }
    }

    // 矩阵加法
    addMatrices(A, B) {
        if (A.length !== B.length || A[0].length !== B[0].length) {
            throw new Error('矩阵维度不匹配，无法进行加法运算');
        }
        
        return A.map((row, i) => 
            row.map((val, j) => val + B[i][j])
        );
    }

    // 矩阵减法
    subtractMatrices(A, B) {
        if (A.length !== B.length || A[0].length !== B[0].length) {
            throw new Error('矩阵维度不匹配，无法进行减法运算');
        }
        
        return A.map((row, i) => 
            row.map((val, j) => val - B[i][j])
        );
    }

    // 矩阵乘法
    multiplyMatrices(A, B) {
        if (A[0].length !== B.length) {
            throw new Error('矩阵维度不匹配，无法进行乘法运算');
        }
        
        const result = [];
        for (let i = 0; i < A.length; i++) {
            result[i] = [];
            for (let j = 0; j < B[0].length; j++) {
                let sum = 0;
                for (let k = 0; k < A[0].length; k++) {
                    sum += A[i][k] * B[k][j];
                }
                result[i][j] = sum;
            }
        }
        return result;
    }

    // 逐元素乘法
    elementWiseMultiply(A, B) {
        if (A.length !== B.length || A[0].length !== B[0].length) {
            throw new Error('矩阵维度不匹配，无法进行逐元素乘法');
        }
        
        return A.map((row, i) => 
            row.map((val, j) => val * B[i][j])
        );
    }

    // 矩阵转置
    transposeMatrix(A) {
        return A[0].map((_, colIndex) => 
            A.map(row => row[colIndex])
        );
    }

    // 标量乘法
    scalarMultiply(scalar, A) {
        return A.map(row => 
            row.map(val => scalar * val)
        );
    }

    // 矩阵幂运算
    matrixPower(A, power) {
        if (A.length !== A[0].length) {
            throw new Error('只有方阵才能进行幂运算');
        }
        if (power < 0) {
            throw new Error('幂指数必须为非负数');
        }
        if (power === 0) {
            return this.createIdentityMatrix(A.length);
        }
        
        let result = A;
        for (let i = 1; i < power; i++) {
            result = this.multiplyMatrices(result, A);
        }
        return result;
    }

    // 创建单位矩阵
    createIdentityMatrix(size) {
        const matrix = [];
        for (let i = 0; i < size; i++) {
            matrix[i] = [];
            for (let j = 0; j < size; j++) {
                matrix[i][j] = i === j ? 1 : 0;
            }
        }
        return matrix;
    }

    // 计算行列式
    determinant(A) {
        if (A.length !== A[0].length) {
            throw new Error('只有方阵才能计算行列式');
        }
        
        if (A.length === 1) return A[0][0];
        if (A.length === 2) return A[0][0] * A[1][1] - A[0][1] * A[1][0];
        
        let det = 0;
        for (let i = 0; i < A[0].length; i++) {
            det += A[0][i] * this.cofactor(A, 0, i);
        }
        return det;
    }

    // 计算余子式
    cofactor(A, row, col) {
        const subMatrix = A.filter((_, i) => i !== row)
                          .map(r => r.filter((_, j) => j !== col));
        return ((row + col) % 2 === 0 ? 1 : -1) * this.determinant(subMatrix);
    }

    // 矩阵求逆
    inverseMatrix(A) {
        if (A.length !== A[0].length) {
            throw new Error('只有方阵才能求逆');
        }
        
        const det = this.determinant(A);
        if (Math.abs(det) < 1e-10) {
            throw new Error('矩阵是奇异的，无法求逆');
        }
        
        if (A.length === 2) {
            return [
                [A[1][1] / det, -A[0][1] / det],
                [-A[1][0] / det, A[0][0] / det]
            ];
        }
        
        // 对于更大的矩阵使用伴随矩阵法
        const adjoint = [];
        for (let i = 0; i < A.length; i++) {
            adjoint[i] = [];
            for (let j = 0; j < A.length; j++) {
                adjoint[i][j] = this.cofactor(A, j, i) / det;
            }
        }
        return adjoint;
    }

    // 计算矩阵秩
    matrixRank(A) {
        const matrix = A.map(row => [...row]);
        const rows = matrix.length;
        const cols = matrix[0].length;
        let rank = 0;
        
        for (let col = 0; col < cols; col++) {
            let pivot = -1;
            for (let row = rank; row < rows; row++) {
                if (Math.abs(matrix[row][col]) > 1e-10) {
                    pivot = row;
                    break;
                }
            }
            
            if (pivot === -1) continue;
            
            [matrix[rank], matrix[pivot]] = [matrix[pivot], matrix[rank]];
            
            for (let row = 0; row < rows; row++) {
                if (row !== rank && Math.abs(matrix[row][col]) > 1e-10) {
                    const factor = matrix[row][col] / matrix[rank][col];
                    for (let c = col; c < cols; c++) {
                        matrix[row][c] -= factor * matrix[rank][c];
                    }
                }
            }
            rank++;
        }
        
        return rank;
    }

    // 显示计算结果
    displayResult(result, operationName) {
        const resultArea = document.getElementById('resultArea');
        const resultMatrix = document.getElementById('resultMatrix');
        const resultText = document.getElementById('resultText');
        
        resultArea.classList.remove('hidden');
        
        if (typeof result === 'number') {
            // 标量结果（行列式、秩等）
            resultMatrix.innerHTML = '';
            resultText.textContent = `${operationName} 结果: ${result.toFixed(6)}`;
        } else {
            // 矩阵结果
            resultText.innerHTML = `
                ${operationName} 结果:
                <button onclick="calculator.copyMatrix(calculator.lastResult)" class="copy-btn">复制结果</button>
            `;
            this.displayMatrix(result, resultMatrix);
            this.animateResult(resultMatrix);
            this.lastResult = result; // 保存最后结果用于复制
        }
    }

    // 显示矩阵
    displayMatrix(matrix, container) {
        container.innerHTML = '';
        container.style.gridTemplateColumns = `repeat(${matrix[0].length}, 1fr)`;
        
        matrix.forEach(row => {
            row.forEach(val => {
                const cell = document.createElement('div');
                cell.className = 'matrix-cell result-display';
                cell.textContent = val.toFixed(4);
                cell.style.display = 'flex';
                cell.style.alignItems = 'center';
                cell.style.justifyContent = 'center';
                container.appendChild(cell);
            });
        });
    }

    // 结果动画
    animateResult(container) {
        const cells = container.querySelectorAll('.matrix-cell');
        anime({
            targets: cells,
            scale: [0, 1],
            opacity: [0, 1],
            duration: 500,
            delay: anime.stagger(100),
            easing: 'easeOutElastic(1, .8)'
        });
    }

    // 添加到历史记录
    addToHistory(operation, result) {
        const historyItem = {
            operation: operation,
            result: result,
            timestamp: new Date().toLocaleString()
        };
        
        this.history.unshift(historyItem);
        if (this.history.length > 10) {
            this.history.pop();
        }
        
        this.updateHistoryDisplay();
        this.saveHistory();
    }

    // 更新历史记录显示
    updateHistoryDisplay() {
        const historyContainer = document.getElementById('history');
        
        if (this.history.length === 0) {
            historyContainer.innerHTML = '<p class="text-gray-400 text-center">暂无计算历史</p>';
            return;
        }
        
        historyContainer.innerHTML = this.history.map(item => `
            <div class="bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <div class="text-blue-400 font-semibold">${item.operation}</div>
                        <div class="text-gray-300 text-sm mt-1">
                            ${typeof item.result === 'number' ? 
                                `结果: ${item.result.toFixed(6)}` : 
                                `矩阵结果: ${item.result.length}×${item.result[0].length}`
                            }
                        </div>
                    </div>
                    <div class="text-gray-500 text-xs">${item.timestamp}</div>
                </div>
            </div>
        `).join('');
    }

    // 保存历史记录
    saveHistory() {
        localStorage.setItem('matrixCalculatorHistory', JSON.stringify(this.history));
    }

    // 加载历史记录
    loadHistory() {
        const saved = localStorage.getItem('matrixCalculatorHistory');
        if (saved) {
            this.history = JSON.parse(saved);
            this.updateHistoryDisplay();
        }
    }

    // 清空历史记录
    clearHistory() {
        this.history = [];
        this.updateHistoryDisplay();
        this.saveHistory();
    }

    // 复制矩阵到剪贴板
    copyMatrix(matrix) {
        if (!matrix || matrix.length === 0) {
            this.showNotification('没有可复制的矩阵', 'error');
            return;
        }
        
        try {
            const matrixText = matrix.map(row => row.join('\t')).join('\n');
            navigator.clipboard.writeText(matrixText).then(() => {
                this.showNotification('矩阵已复制到剪贴板', 'success');
            }).catch(() => {
                // 降级方案
                this.fallbackCopyTextToClipboard(matrixText);
            });
        } catch (error) {
            this.showNotification('复制失败', 'error');
        }
    }
    copyOperMatrix(target){
        this.updateMatrixData('A');
        this.updateMatrixData('B');
        this.copyMatrix(target == 'A' ? this.matrixA : this.matrixB);
    }

    // 降级复制方法
    fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.position = 'fixed';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            this.showNotification('矩阵已复制到剪贴板', 'success');
        } catch (err) {
            this.showNotification('复制失败', 'error');
        }
        document.body.removeChild(textArea);
    }

    // 从剪贴板粘贴矩阵
    async pasteMatrix(matrixName) {
        try {
            const clipboardText = await navigator.clipboard.readText();
            if (!clipboardText) {
                this.showNotification('剪贴板为空', 'error');
                return;
            }
            
            const rows = clipboardText.trim().split('\n');
            const matrix = rows.map(row => 
                row.split('\t').map(cell => parseFloat(cell.trim()) || 0)
            );
            
            if (matrix.length === 0 || matrix[0].length === 0) {
                this.showNotification('无效的矩阵格式', 'error');
                return;
            }
            
            // 更新矩阵尺寸选择器
            const rowsSelect = document.getElementById(`rows${matrixName}`);
            const colsSelect = document.getElementById(`cols${matrixName}`);
            
            if (rowsSelect && colsSelect) {
                rowsSelect.value = Math.min(matrix.length, 5);
                colsSelect.value = Math.min(matrix[0].length, 5);
                this.updateMatrixSize(matrixName);
                
                // 等待DOM更新后填充数据
                setTimeout(() => {
                    this.fillMatrixFromData(matrixName, matrix);
                }, 100);
            }
            
            this.showNotification('矩阵已粘贴', 'success');
        } catch (error) {
            this.showNotification('粘贴失败，请检查剪贴板权限', 'error');
        }
    }

    // 从数据填充矩阵
    fillMatrixFromData(matrixName, matrix) {
        const container = document.getElementById(`matrix${matrixName}`);
        const inputs = container.querySelectorAll('.matrix-cell');
        const rows = parseInt(document.getElementById(`rows${matrixName}`).value);
        const cols = parseInt(document.getElementById(`cols${matrixName}`).value);
        
        inputs.forEach((input, index) => {
            const i = Math.floor(index / cols);
            const j = index % cols;
            if (i < matrix.length && j < matrix[i].length) {
                input.value = matrix[i][j];
            }
        });
        
        this.updateMatrixData(matrixName);
    }

    // 显示通知
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
        
        switch (type) {
            case 'success':
                notification.className += ' bg-green-600 text-white';
                break;
            case 'error':
                notification.className += ' bg-red-600 text-white';
                break;
            default:
                notification.className += ' bg-blue-600 text-white';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // 隐藏动画
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// 全局函数
function scrollToCalculator() {
    document.getElementById('calculator').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

function updateMatrixSize(matrixName) {
    calculator.updateMatrixSize(matrixName);
}

function fillMatrix(matrixName, type) {
    calculator.fillMatrix(matrixName, type);
}

function clearMatrix(matrixName) {
    calculator.clearMatrix(matrixName);
}

function performOperation(operation) {
    calculator.performOperation(operation);
}

function clearHistory() {
    calculator.clearHistory();
}

// 初始化计算器
let calculator;
document.addEventListener('DOMContentLoaded', function() {
    calculator = new MatrixCalculator();
    
    // 页面加载动画
    anime({
        targets: '.glass-panel',
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 800,
        delay: anime.stagger(200),
        easing: 'easeOutQuart'
    });
    
    // 标题动画
    anime({
        targets: '.hero-title',
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutElastic(1, .8)'
    });
});