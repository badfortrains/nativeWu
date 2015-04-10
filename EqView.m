//
//  EqView.m
//  nativeWu
//
//  Created by Sean Purcell on 4/8/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import "EqView.h"

@implementation EqView{
    CALayer* _bar1;
    CALayer* _bar2;
    CALayer* _bar3;

    float _barHeight;
    BOOL _animationEnabled;
}

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        _bar1 = [CALayer layer];
        _bar2 = [CALayer layer];
        _bar3 = [CALayer layer];
        
        [self.layer addSublayer:_bar1];
        [self.layer addSublayer:_bar2];
        [self.layer addSublayer:_bar3];
        
        [self registerForAppStateNotifications];
    }
    return self;
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    
    [_bar1 removeAllAnimations];
    [_bar2 removeAllAnimations];
    [_bar3 removeAllAnimations];

    
    _barHeight = self.frame.size.height * 0.2;
    [self setupLayer:_bar1 withOffset:0.0f];
    [self setupLayer:_bar2 withOffset:_barHeight * 2];
    [self setupLayer:_bar3 withOffset:_barHeight * 4];
    
    if(_animationEnabled){
        [self animate];
    }
    
}

- (void)setEnableAnimation:(BOOL)enableAnimation{
    _animationEnabled = enableAnimation;
    
    if(_barHeight == 0){
        return;
    }
    
    if(enableAnimation){
        [self animate];
    }else{
        [self shrinkBar:_bar1];
        [self shrinkBar:_bar2];
        [self shrinkBar:_bar3];
    }
}

-(void)shrinkBar:(CALayer*)bar{
    CAAnimation* grow = [bar animationForKey:@"grow"];
    if(grow){
        [bar addAnimation:[self setupShrinkAnimation:grow.duration forLayer:bar] forKey:@"shrink"];
        [bar removeAnimationForKey:@"grow"];
    }
}

-(CABasicAnimation*)setupShrinkAnimation:(CFTimeInterval)oldDuration forLayer:(CALayer*)layer{
    NSNumber* currentHeight = [layer.presentationLayer valueForKeyPath:@"bounds.size.height"];
    CABasicAnimation *shrink = [CABasicAnimation animationWithKeyPath:@"bounds.size.height"];
    shrink.fromValue = currentHeight;
    shrink.toValue = [NSNumber numberWithFloat:_barHeight];
    //scale duration based on the distance we are animating over so it matches the current speed
    shrink.duration = ((currentHeight.floatValue - _barHeight) / (self.frame.size.height - _barHeight)) * oldDuration;
    shrink.timingFunction = [CAMediaTimingFunction functionWithName:kCAAnimationLinear];
    shrink.delegate = self;
    return shrink;
}


- (void)setupLayer:(CALayer*)bar withOffset:(float)offset
{
    bar.anchorPoint = CGPointMake(0.5, 1);
    bar.frame = CGRectMake(offset, self.frame.size.height - _barHeight, _barHeight, _barHeight);
    bar.backgroundColor = _barColor.CGColor;
}


-(CABasicAnimation*)setupAnimation:(CFTimeInterval)duration{
    CABasicAnimation *grow = [CABasicAnimation animationWithKeyPath:@"bounds.size.height"];
    grow.toValue   = [NSNumber numberWithFloat:self.frame.size.height - _barHeight];
    grow.duration = duration;
    grow.repeatCount = HUGE_VAL;
    grow.autoreverses = true;
    grow.timingFunction = [CAMediaTimingFunction functionWithName:kCAAnimationLinear];
    grow.delegate = self;
    return grow;
}


-(void)animate{
    [_bar1 addAnimation:[self setupAnimation:.4] forKey:@"grow" ];
    [_bar2 addAnimation:[self setupAnimation:0.35] forKey:@"grow"];
    [_bar3 addAnimation:[self setupAnimation:.55] forKey:@"grow"];
}

- (void)registerForAppStateNotifications {
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(applicationWillEnterForeground) name:UIApplicationWillEnterForegroundNotification object:nil];
}

- (void)dealloc {
    [self unregisterFromAppStateNotifications];
}

- (void)unregisterFromAppStateNotifications {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)applicationWillEnterForeground {
    if(_animationEnabled){
        [self animate];
    }
}
@end
