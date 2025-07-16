module.exports.formatUserProfile = ({ user, challenges, incomes, expenses }) => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
    const recentIncomes = incomes.filter(i => new Date(i.received_date) >= oneMonthAgo);
    const recentExpenses = expenses.filter(e => new Date(e.date) >= oneMonthAgo);
  
    const completed = challenges.filter(c => c.status === 'completed').length;
    const failed = challenges.filter(c => c.status === 'failed').length;
  
    const goalSuccessRate = Math.round((completed / (completed + failed + 1)) * 100);
  
    const totalIncome = recentIncomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = recentExpenses.reduce((sum, e) => sum + e.amount, 0);
  
    return `
      User: ${user.nickname || 'User'} 
      Goal Success Rate: ${goalSuccessRate}%
  
      Income (last 30 days): ${totalIncome.toFixed(2)} EGP
      Expenses (last 30 days): ${totalExpenses.toFixed(2)} EGP
  
      Challenge Stats:
      - Completed: ${completed}
      - Failed: ${failed}
    `;
  };
  