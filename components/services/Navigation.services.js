class NavigationService {
    constructor() {
      this.history = [{ screen: 'Home', params: {} }];
      this.listeners = [];
    }
  
    navigate = (screen, params = {}) => {
      this.history.push({ screen, params });
      this.notifyListeners();
    };
  
    goBack = () => {
      if (this.history.length > 1) {
        this.history.pop();
        this.notifyListeners();
      }
    };
  
    resetToHome = () => {
      this.history = [{ screen: 'Home', params: {} }];
      this.notifyListeners();
    };
  
    getCurrentScreen = () => {
      return this.history[this.history.length - 1];
    };
  
    addListener = (listener) => {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter(l => l !== listener);
      };
    };
  
    notifyListeners = () => {
      this.listeners.forEach(listener => listener());
    };
  }
  
  export default new NavigationService();