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

- (CALayer*)setupLayer:(float)offset
{
    CALayer* bar = [CALayer layer];
    bar.anchorPoint = CGPointMake(0.5, 1);
    bar.frame = CGRectMake(offset, self.frame.size.height - _barHeight, _barHeight, _barHeight);
    bar.backgroundColor = [UIColor blueColor].CGColor;
    [self.layer addSublayer:bar];
    return bar;
}

- (void)baseInit {
    NSLog(@"start the animation");
    NSLog(@"height of frame in init %f",self.frame.size.height);
    //create sublayer

}

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        [self baseInit];
    }
    return self;
}

- (id)initWithCoder:(NSCoder *)aDecoder {
    if ((self = [super initWithCoder:aDecoder])) {
        [self baseInit];
    }
    return self;
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    NSLog(@"height of frame %f",self.frame.size.height);
    
    [_bar1 removeAllAnimations];
    [_bar2 removeAllAnimations];
    [_bar3 removeAllAnimations];
    
    
    _barHeight = self.frame.size.height * 0.2;
    if(_animationEnabled){
        _bar1 = [self setupLayer:0.0f];
        _bar2 = [self setupLayer:_barHeight * 2];
        _bar3 = [self setupLayer:_barHeight * 4];
        [self animate];
    }
    
}

- (void)setEnableAnimation:(BOOL)enableAnimation{
    //not intialized yet
    _animationEnabled = enableAnimation;
    
    if(_barHeight == 0){
        return;
    }
    
    if(enableAnimation){
        _bar1 = [self setupLayer:0.0f];
        _bar2 = [self setupLayer:_barHeight * 2];
        _bar3 = [self setupLayer:_barHeight * 4];
        [self animate];
    }else{
        [self clearAnimations];
    }
}

- (void)animationDidStop:(CAAnimation *)theAnimation finished:(BOOL)flag
{
    NSLog(@"Hello end animation");
}

-(void)clearAnimations{
    [self shrinkBar:_bar1];
    [self shrinkBar:_bar2];
    [self shrinkBar:_bar3];
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
    NSLog(@"bar height is %@",currentHeight);
    CABasicAnimation *shrink = [CABasicAnimation animationWithKeyPath:@"bounds.size.height"];
    shrink.fromValue = currentHeight;
    shrink.toValue = [NSNumber numberWithFloat:_barHeight];
    shrink.duration = ((currentHeight.floatValue - _barHeight) / (self.frame.size.height - _barHeight)) * oldDuration;
    shrink.timingFunction = [CAMediaTimingFunction functionWithName:kCAAnimationLinear];
    shrink.delegate = self;
    return shrink;
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
    [_bar1 addAnimation:[self setupAnimation:.5] forKey:@"grow" ];
    [_bar2 addAnimation:[self setupAnimation:0.45] forKey:@"grow"];
    [_bar3 addAnimation:[self setupAnimation:.65] forKey:@"grow"];
}
@end
